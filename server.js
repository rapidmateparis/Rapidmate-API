require('dotenv-safe').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const i18n = require('i18n');
const path = require('path');
const http = require('http');
const cron = require('node-cron');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Notification =require('./app/models/Notification');
const orderControl =require('./app/controllers/deliveryboy/orders/order')
const eOrderControl =require('./app/controllers/enterprise/orders/order')
const { updateDeliveryboyLatlng, addLatlng, addOrderLatlng } = require('./app/middleware/utils');
const httpRequestResponseInterceptor =require('./config/Interceptor');
const rateLimit = require('express-rate-limit');
const logger = require('./config/log').logger;
const redisClient = require('./config/cacheClient')

require('log4js').configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'apptracklog.log' }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
});
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 50 requests per `windowMs`
  message: { error: "Too many requests, please try again later." },
  headers: true, // Send rate limit info in headers
});

//app.use(limiter); 

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://rapidmate.fr',
  'https://admin.rapidmate.fr',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  })
);

mongoose.connect('mongodb://localhost:27017/rapidmatemdb', { useNewUrlParser: true, useUnifiedTopology: true });
TZ="UTC";
//TZ = "Europe/Paris";
////console.log("Timezone", new Date().toString());
const server = http.createServer(app);
const io = socketIo(server);

app.use(httpRequestResponseInterceptor);
app.set('port', process.env.PORT || 3004);
app.set('io', io);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  bodyParser.json({
    limit: '20mb',
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true,
  })
);

i18n.configure({
  locales: ['en', 'es', 'fr'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true,
  header: 'accept-language'
});
app.use((req, res, next) => {
  const pathValue = req.path;
  if(!pathValue.includes("login")){
    requestData = {
      method : req.method,
      api :  req.url,
      data : req.body
    };
    logger.info(requestData);
    next(); // Pass control to the next middleware/route
  }else{
    next();
  }
});

app.use(i18n.init);

app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/api', require('./app/routes'));

io.on('connection', (socket) => {
  //console.log('A user connected', socket.id);

  socket.on('join', (driverId) => {
    socket.join(driverId);
    //console.log(`Driver ${driverId} joined room ${driverId}`);
  });

  socket.on('update-latlng',async (data)=>{
    const {delivery_boy_id,latitude,longitute}=data
    //update delivery boy latitude and longitude
    const res =await updateDeliveryboyLatlng(delivery_boy_id,latitude,longitute)
    if(res){
      io.emit('new-latlng',data)
    } 
  });
  // add mongo db latlng here
  socket.on('add-latlng',async (data)=>{
    const {delivery_boy_id,latitude,longitute}=data
    const res=await addLatlng(delivery_boy_id,latitude,longitute);
    if(res){
      io.emit('get-latng',{delivery_boy_id});
    }
  })
  
  socket.on('add-order-latlng',async (data)=>{
    const {order_number,latitude,longitute}=data
    const res=await addOrderLatlng(order_number,latitude,longitute)
    io.emit('send-location',{order_number,latitude,longitute})
  })
  socket.on('disconnect', () => {
    //console.log('User disconnected', socket.id);
  });
});
// set cron for automatic delete notification at 23:59 pm

const softDeleteOldNotifications = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 14); // Calculate the date 2 week ago
  try {
    const result = await Notification.updateMany(
      { createdAt: { $lt: oneWeekAgo }, is_del: false },
      { $set: { is_del: true } }
    );
    logger.info({message : `${result.modifiedCount} notifications soft-deleted.`})
  } catch (err) {
    logger.error({message : "Error soft-deleting old notifications", error : err})
  }
};

cron.schedule('59 23 * * *', () => { softDeleteOldNotifications(); });

cron.schedule("*/30 * * * * *", function() { 
  logger.warn({message : "Schedule Order : Running...", data : new Date()})
  orderControl.cronJobScheduleOrderAllocateDeliveryBoyByOrderNumber();
});

cron.schedule("*/30 * * * * *", function() { 
  logger.warn({message : "Schedule E-Order : Running...", data : new Date()})
  eOrderControl.cronJobScheduleOrderAllocateDeliveryBoyByEOrderNumber();
});

cron.schedule("*/5 * * * * *", function() { 
  logger.warn({message : "Reallocate Order : Running...", data : new Date()})
  orderControl.cronJobRemoveAllocatedDeliveryBoyByOrderNumber();
});

cron.schedule("*/5 * * * * *", function() { 
  logger.warn({message : "Check Payment status : Running...", data : new Date()})
  orderControl.cronJobCheckPaymentStatusByOrderNumber();
});


server.listen(app.get('port'), () => {
  logger.warn({message : "Server is running on port", port : app.get('port')})
});

app.use((err, req, res, next) => {
  console.error(err); // Log the original error

  // Send a custom error response
  res.status(500).json({
    message: 'A network request failed. Please try again later.',
    error: err.message, // Include the original error message for debugging purposes
  });
});

app.get('/health', async (req, res) => {
  try {
    await redisClient.ping();
    res.send('Redis is healthy ✅');
  } catch (err) {
    res.status(500).send('Redis not reachable ❌');
  }
});

module.exports = app;