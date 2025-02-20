const express = require('express');
const { login, update } = require('../service/admin_service');
const { formatRes } = require('../utils/res');
const { validateToken } = require('../utils/validate_token');
const { ValidationError } = require('../utils/errors');
const router = express.Router();

router.post('/login', async function (req, res, next) {
    if (req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        res.send(new ValidationError('验证码错误').toResJSON());
    }
    const result = await login(req.body);
    console.log(result);
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
