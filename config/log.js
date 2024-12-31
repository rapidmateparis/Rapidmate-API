const winston = require('winston');
const moment = require("moment");
const fs = require("fs");

const getConfigure = ()=> {
  var uploadDirectory = moment(new Date()).format("YYYY/MM/DD/");
  var fullDirectoryPath = process.env.LOGGER_FILE_PATH  + uploadDirectory;
  if (!fs.existsSync(fullDirectoryPath)){
      fs.mkdirSync(fullDirectoryPath, { recursive: true });
  }
  filename = fullDirectoryPath + moment(new Date()).format("HH") + ".log";
  console.log(filename);
  return filename;
}

const logConfiguration = {
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      //myFormatter,
      winston.format.simple(),
    ),
    'transports': [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: getConfigure()
        })
    ]
};

/* const myFormatter = winston.format((info) => {
  const {message} = info;

  if (info.data) {
    info.message = `${message} ${JSON.stringify(info.data)}`;
    delete info.data; // We added `data` to the message so we can delete it
  }
  
  return info;
})();
 */
const logger = winston.createLogger(logConfiguration);
exports.logger = logger;
exports.getConfigure = getConfigure;