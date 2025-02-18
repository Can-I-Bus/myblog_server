const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const md5 = require('md5');
const session = require('express-session');
const { expressjwt } = require('express-jwt');
const { ForbiddenError, ServiceError, UnKnowError } = require('./utils/errors');

//读取项目根目录下的env文件
require('dotenv').config();
require('express-async-errors');
//数据库连接
require('./dao/init');

const admin_router = require('./routes/admin');
const captcha_router = require('./routes/captcha');
const banner_router = require('./routes/banner');
const upload_router = require('./routes/upload');
const blog_type_router = require('./routes/blog_type');
const article_router = require('./routes/article');

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true, //表示是否每次都重新保存session，即使没有修改
        saveUninitialized: true, //表示是否每次都初始化session，即使没有修改
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置 JWT 验证
const jwtSecret = md5(process.env.JWT_SECRET);

app.use(
    expressjwt({
        secret: jwtSecret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: '/api/admin/login', methods: ['POST'] },
            { url: '/res/captcha', methods: ['GET'] },
            { url: '/api/banner', methods: ['GET'] },
            { url: '/api/article', methods: ['GET'] },
            { url: '/api/blog_type', methods: ['GET'] },
        ],
        custom: (req) => {
            if (req.path.startsWith('/api/article') && req.method === 'GET' && req.query?.id && req.query.id.trim() !== '') {
                return true;
            }
            return false;
        },
    })
);

app.use('/api/admin', admin_router);
app.use('/res/captcha', captcha_router);
app.use('/api/banner', banner_router);
app.use('/api/upload', upload_router);
app.use('/api/blog_type', blog_type_router);
app.use('/api/article', article_router);

app.use(function (req, res, next) {
    next(createError(404));
});

// 错误处理，发生错误就在这里处理
app.use(function (err, req, res, next) {
    //处理token错误
    if (err.name === 'UnauthorizedError') {
        res.send(new ForbiddenError('未登陆或登录过期').toResJSON());
    } else if (err instanceof ServiceError) {
        res.send(err.toResJSON());
    } else {
        res.send(new UnKnowError().toResJSON());
    }
    console.error(err);
});

module.exports = app;
