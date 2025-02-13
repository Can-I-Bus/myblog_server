const express = require('express');
const { login, update } = require('../service/admin_service');
const { formatRes } = require('../utils/res');
const { validateToken } = require('../utils/validate_token');
const router = express.Router();

router.post('/login', async function (req, res, next) {
    const result = await login(req.body);
    if (result?.token) {
        res.setHeader('authorization', result.token);
    }
    res.send(formatRes(0, 'ok', result.data));
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
