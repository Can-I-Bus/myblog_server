const multer = require('multer');
const MAO = require('multer-aliyun-oss');
const OSS = require('ali-oss');
const { BadRequest } = require('http-errors');

const config = {
    region: process.env.ALYUN_REGION,
    accessKeyId: process.env.ALYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALYUN_ACCESS_KEY_SECRET,
    bucket: process.env.ALYUN_BUCKET,
};

const client = new OSS(config);

const upload = multer({
    storage: MAO({
        config: config,
        destination: 'uploads',
    }),
    limits: {
        fileSize: 1024 * 1024 * 5, // 限制文件大小为5MB
    },
    fileFilter: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[0];
        const isImage = fileType === 'image';
        if (!isImage) {
            return cb(new BadRequest('只能上传图片文件'));
        }
        cb(null, true);
    },
});

const singleFileUpload = upload.single('file');

module.exports = {
    singleFileUpload,
    client,
    config,
};
