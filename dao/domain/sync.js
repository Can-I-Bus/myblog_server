const admin = require('./admin');
const banner = require('./banner');
const sequelize = require('../db_connect');
const blog_type = require('./blog_type');
const article = require('./article');
const comment = require('./comment');
const message = require('./message');
require('./demo');
const md5 = require('md5');
(async () => {
    blog_type.hasMany(article, { foreignKey: 'category_id', targetKey: 'id' });
    article.belongsTo(blog_type, { foreignKey: 'category_id', targetKey: 'id', as: 'category' });

    // 自关联：一个文件夹可以有多个子文件夹
    blog_type.hasMany(blog_type, {
        foreignKey: 'parent_id', // 外键
        as: 'children', // 别名
        onDelete: 'CASCADE', // 级联删除
        onUpdate: 'CASCADE',
    });

    // 一个子文件夹属于一个父文件夹
    blog_type.belongsTo(blog_type, {
        foreignKey: 'parent_id',
        as: 'parent',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    article.hasMany(comment, { foreignKey: 'article_id', targetKey: 'id' });
    comment.belongsTo(article, { foreignKey: 'article_id', targetKey: 'id', as: 'article' });

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
