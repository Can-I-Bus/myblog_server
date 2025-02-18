const express = require('express');
const router = express.Router();
const { get_records, update_article, add_article, delete_article } = require('../service/article_service');

//获取文章列表
router.get('/', async function (req, res, next) {
    const token = req.headers.authorization || '';
    const { id = '', page = 1, limit = 50, category_id = '' } = req.query;
    res.send(await get_records({ id, page, limit, category_id, token }));
});

//添加文章
router.post('/', async function (req, res, next) {
    res.send(await add_article(req.body));
});

//修改文章
router.put('/', async function (req, res, next) {
    res.send(await update_article(req.body));
});

//删除文章
router.delete('/', async function (req, res, next) {
    res.send(await delete_article(req.query.id));
});

module.exports = router;
