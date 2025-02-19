const express = require('express');
const router = express.Router();
const { get_message_list, add_message, delete_message } = require('../service/message_service');

//获取message
router.get('/', async function (req, res, next) {
    const { id = '', page = 1, limit = 50 } = req.query;
    res.send(await get_message_list({ id, page, limit }));
});

//新增message
router.post('/', async function (req, res, next) {
    res.send(await add_message(req.body));
});

//删除message
router.delete('/', async function (req, res, next) {
    const { id = '' } = req.query;
    res.send(await delete_message(id));
});

module.exports = router;
