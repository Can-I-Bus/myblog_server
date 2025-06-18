const express = require('express');
const router = express.Router();
const { get_demo_list, update_demo, add_demo, delete_demo } = require('../service/demo_service');

//获取demo
router.get('/', async function (req, res, next) {
    const { id = '', page = 1, limit = 50 } = req.query;
    res.send(await get_demo_list({ id, page, limit }));
});

//新增demo
router.post('/', async function (req, res, next) {
    res.send(await add_demo(req.body));
});

//修改demo
router.put('/', async function (req, res, next) {
    const { id } = req.body;
    res.send(await update_demo(id, req.body));
});

//删除demo
router.delete('/', async function (req, res, next) {
    const { id = '' } = req.query;
    res.send(await delete_demo(id));
});

module.exports = router;
