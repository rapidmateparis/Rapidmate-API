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
const socketIo = require('socket.io');
const mongoose = require('mongoose');
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
mongoose.connect('mongodb://localhost:27017/pickup-dropoff', { useNewUrlParser: true, useUnifiedTopology: true });

const server = http.createServer(app);
const io = socketIo(server);

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
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true,
});
app.use(i18n.init);

app.use(
  cors({
    origin: '*',
  })
);
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

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(app.get('port'), () => {
  console.log('Server is running on port', app.get('port'));
});

module.exports = app;
