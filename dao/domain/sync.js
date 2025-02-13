const admin = require('./admin');
const sequelize = require('../db_connect');
const md5 = require('md5');
(async () => {
    await sequelize.sync({ alter: true });
    const admin_count = await admin.count();
    if (!admin_count) {
        await admin.create({
            login_id: 'admin',
            name: '超级管理员',
            login_pwd: md5('123456'),
        });
        console.log('初始化管理员数据完成');
    }
    console.log('所有数据库模型同步成功');
})();
