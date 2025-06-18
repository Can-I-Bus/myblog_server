const express = require('express');
const { login, update } = require('../service/admin_service');
const { formatRes } = require('../utils/res');
const { validateToken } = require('../utils/validate_token');
const { ValidationError } = require('../utils/errors');
const router = express.Router();

// 添加检查 session 的路由
router.get('/check-session', function (req, res) {
    res.json({
        sessionId: req.session.id,
        hasCaptcha: !!req.session.captcha,
        captcha: req.session.captcha, // 仅用于调试
        sessionContent: req.session,
        cookies: req.cookies,
    });
});

router.post('/login', async function (req, res, next) {
    console.log('登录请求 - Session ID:', req.session.id);
    console.log('登录请求 - Session内容:', req.session);
    console.log('登录请求 - 请求体:', req.body);
    console.log('登录请求 - 请求头:', req.headers);
    console.log('登录请求 - Cookies:', req.cookies);

    // 移除验证码验证部分，直接进行账号密码验证
    const result = await login(req.body);
    console.log('登录结果:', result);

    if (result?.user) {
        res.send(formatRes(0, 'ok', result));
    } else {
        res.send(formatRes(1, '用户名或密码错误', null));
    }
});

router.get('/validate_token', async function (req, res, next) {
    const result = validateToken(req.get('authorization').split(' ')[1]);
    res.send(
        formatRes(0, 'ok', {
            login_id: result.login_id,
            name: result.name,
            id: result.id,
        })
    );
});

router.put('/', async function (req, res, next) {
    res.send(await update(req.body));
});

module.exports = router;
