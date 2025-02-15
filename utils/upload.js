const multer = require('multer');
const path = require('path');
const path_name = path.resolve(__dirname, '../public/static/uploads/');

//设置上传文件的引擎
const storage = multer.diskStorage({
    //设置文件保存路径
    destination: function (req, file, cb) {
        cb(null, path_name);
    },
    //上传到服务器的名字
    filename: function (req, file, cb) {
        const basename = path.basename(file.originalname, path.extname(file.originalname));
        const extname = path.extname(file.originalname);
        const new_name = basename + new Date().getTime() + Math.floor(Math.random() * 9000 + 1000) + extname;
        cb(null, new_name);
    },
});

module.exports.upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2, //限制文件大小为2M
        files: 1, //限制文件数量
    },
});
