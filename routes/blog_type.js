const express = require('express');
const router = express.Router();
const { get_blog_type_list, update_blog_type, add_blog_type, delete_blog_type } = require('../service/blog_type_service');

//获取分类
router.get('/', async function (req, res, next) {
    res.send(await get_blog_type_list());
});

//添加分类
router.post('/', async function (req, res, next) {
    res.send(await add_blog_type(req.body));
});

//修改首分类
router.put('/', async function (req, res, next) {
    res.send(await update_blog_type(req.body));
});

//删除分类
router.delete('/', async function (req, res, next) {
    res.send(await delete_blog_type(req.query.id));
});

module.exports = router;
