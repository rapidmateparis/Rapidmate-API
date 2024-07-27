const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var uploadType = req.headers.upload_type;
    var uploadDir = "common";
    console.log(uploadType);
    if(uploadType = "ORDER_DOC"){
        uploadDir = process.env.ORDER_DOC
    } else if(uploadType = "DELIVERY_BOY"){
        uploadDir = process.env.DELIVERY_BOY
    } else{
        uploadDir = "common";
    }
    cb(null,process.env.BASE_RESOURCE_DIR + uploadDir);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;