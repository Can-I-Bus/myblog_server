const express = require('express');
const multer = require('multer');
const router = express.Router();
const { upload } = require('../utils/upload');
const { formatRes } = require('../utils/res');
const { UploadError } = require('../utils/errors');

//上传
router.post('/', async function (req, res, next) {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            next(new UploadError(err.message));
        } else {
            res.send(formatRes(0, 'ok', '/static/uploads' + req.file.path));
        }
    });
});

module.exports = router;
