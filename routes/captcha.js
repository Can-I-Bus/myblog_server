const express = require('express');
const { getCaptcha } = require('../service/captcha_service');
const router = express.Router();

router.get('/', async function (req, res, next) {
    const result = await getCaptcha();
    console.log(result);
    req.session.captcha = result.text;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(result.data);
});

module.exports = router;
