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
const { updateDeliveryboyLatlng, addLatlng, addOrderLatlng } = require('./app/middleware/utils');
const httpRequestResponseInterceptor =require('./config/Interceptor');

const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT, DELETE', // Allow only these methods
  allowedHeaders: ['Content-Type', 'rapid_token', 'Rapid_token'] // Allow only these headers
};

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
//app.use(cors(corsOptions));
mongoose.connect('mongodb://localhost:27017/rapidmatemdb', { useNewUrlParser: true, useUnifiedTopology: true });
TZ = "Asia/Calcutta";
console.log("Timezone", new Date().toString());
const server = http.createServer(app);
const io = socketIo(server);
//app.use(httpRequestResponseInterceptor);
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
});
app.use(i18n.init);

app.use(cors({origin: '*',}));
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/api', require('./app/routes'));

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join', (driverId) => {
    socket.join(driverId);
    console.log(`Driver ${driverId} joined room ${driverId}`);
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
    console.log('User disconnected', socket.id);
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

    console.log(`${result.modifiedCount} notifications soft-deleted.`);
  } catch (err) {
    console.error('Error soft-deleting old notifications:', err);
  }
};

cron.schedule('59 23 * * *', () => {
  softDeleteOldNotifications();
});

cron.schedule("*/10 * * * * *", function() {
  console.log("Schedule Order : Running..." , new Date());
  orderControl.cronJobScheduleOrderAllocateDeliveryBoyByOrderNumber();
});
server.listen(app.get('port'), () => {
  console.log('Server is running on port', app.get('port'));
});



module.exports = app;
