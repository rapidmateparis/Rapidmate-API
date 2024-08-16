const uploadFile = require("../../../middleware/document.utils");
const fs = require("fs");
const moment = require("moment");
const utils = require('../../../middleware/utils')
const { runQuery,fetch} = require('../../../middleware/db');
const { Console } = require("console");
const BASE_DIR  = process.env.BASE_RESOURCE_DIR;
const { v4: uuidv4 } = require('uuid');

const upload = async (req, res) => {
  try {
    var uploadDirectory = moment(new Date()).format("YYYY/MM/DD/HH/");
    console.log(uploadDirectory);
    var fullDirectoryPath = BASE_DIR + uploadDirectory;
    if (!fs.existsSync(fullDirectoryPath)){
        fs.mkdirSync(fullDirectoryPath, { recursive: true });
    }
    req.dir = fullDirectoryPath;
    console.log(req.dir);
    await uploadFile(req, res);
   
    if (req.file == undefined) {
      return res.status(400).send({ error: "unable to upload", id : null });
    }
    const refNo = uuidv4().replaceAll("-","");
    const persist = "INSERT INTO rmt_document(file_name, path, ref_no) VALUES('" + req.file.originalname + "','" + uploadDirectory + "', '" + refNo + "')";
    const persistRes = await runQuery(persist);
    res.status(200).send({
        id: refNo , error: null
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = BASE_DIR + "/resources/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = async (req, res) => {
  console.log(req.params.name);
  try {
    const data =await runQuery("select * from rmt_document where ref_no = '" + req.params.name + "'");
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="File not found";
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    res.download(process.env.BASE_RESOURCE_DIR + data[0].path + data[0].file_name, data[0].file_name, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
    });
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
 
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = BASE_DIR + "/resources/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = BASE_DIR + "/resources/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  remove,
  removeSync,
};