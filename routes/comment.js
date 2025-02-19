const express = require('express');
const router = express.Router();
const { get_comment_list, add_comment, delete_comment } = require('../service/comment_service');

//获取comment
router.get('/', async function (req, res, next) {
    const { id = '', page = 1, limit = 50 } = req.query;
    res.send(await get_comment_list({ id, page, limit }));
});

//新增comment
router.post('/', async function (req, res, next) {
    res.send(await add_comment(req.body));
});

//删除comment
router.delete('/', async function (req, res, next) {
    const { id = '' } = req.query;
    res.send(await delete_comment(id));
});

module.exports = router;
