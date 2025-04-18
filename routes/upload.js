const express = require('express');
const multer = require('multer');
const router = express.Router();
const { upload } = require('../utils/upload');
const { formatRes } = require('../utils/res');
const { UploadError } = require('../utils/errors');
const { config, client, singleFileUpload } = require('../utils/aliyun');

//上传
router.post('/', async function (req, res, next) {
    singleFileUpload(req, res, function (err) {
        if (err) {
            next(new UploadError(err.message));
        }
        if (!req.file) {
            next(new UploadError('请上传文件'));
        }
        res.send(formatRes(0, 'ok', { file: req.file }));
    });
});

module.exports = router;
