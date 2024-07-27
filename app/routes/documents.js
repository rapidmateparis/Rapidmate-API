const express = require("express");
const router = express.Router()
const controller = require("../controllers/document.controller");

router.post("/upload", controller.upload);
router.get("/files", controller.getListFiles);
router.get("/view/:name", controller.download);
router.delete("/delete/:name", controller.remove);

module.exports = router