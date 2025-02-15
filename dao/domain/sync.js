const admin = require('./admin');
const banner = require('./banner');
const sequelize = require('../db_connect');
const md5 = require('md5');
(async () => {
    await sequelize.sync({ alter: true });
    // 初始化管理员数据
    const admin_count = await admin.count();
    if (!admin_count) {
        await admin.create({
            login_id: 'admin',
            name: '超级管理员',
            login_pwd: md5('123456'),
        });
        console.log('初始化管理员数据完成');
    }

    //初始化banner数据
    const banner_count = await banner.count();
    if (!banner_count) {
        await banner.bulkCreate([
            {
                title: 'banner1',
                mid_img: 'http://localhost:3000/banner/banner1.jpg',
                big_img: 'http://localhost:3000/banner/banner1.jpg',
                description: 'banner1',
            },
            {
                title: 'banner2',
                mid_img: 'http://localhost:3000/banner/banner2.jpg',
                big_img: 'http://localhost:3000/banner/banner2.jpg',
                description: 'banner2',
            },
            {
                title: 'banner3',
                mid_img: 'http://localhost:3000/banner/banner3.jpg',
                big_img: 'http://localhost:3000/banner/banner3.jpg',
                description: 'banner3',
            },
        ]);
        console.log('初始化首页标语数据完成');
    }
    console.log('所有数据库模型同步成功');
})();
