const express = require('express');
const router = express.Router();
const { get_banner_list, update_banner, add_banner, delete_banner } = require('../service/banner_service');

//获取首页banner
router.get('/', async function (req, res, next) {
    res.send(await get_banner_list());
});

//添加首页banner
router.post('/', async function (req, res, next) {
    res.send(await add_banner(req.body));
});

//修改首页banner
router.put('/', async function (req, res, next) {
    res.send(await update_banner(req.body));
});

//删除banner
router.delete('/', async function (req, res, next) {
    res.send(await delete_banner(req.query.id));
});

module.exports = router;
