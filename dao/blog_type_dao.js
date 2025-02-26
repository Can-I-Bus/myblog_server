const blog_type = require('./domain/blog_type');
const article = require('./domain/article');
const comment = require('./domain/comment');
const { Op } = require('sequelize');

async function get_need_delete_id(id) {
    const category_id_list = [id]; //需要删除的分类id
    //获取该分类下的所有子分类id
    const sub_category_id_list = await blog_type.findAll({
        attributes: ['id'],
        where: {
            parent_id: id,
        },
    });

    if (sub_category_id_list.length > 0) {
        //如果有子分类，则递归获取所有子分类id
        for (let i = 0; i < sub_category_id_list.length; i++) {
            const sub_category_id = sub_category_id_list[i].id;
            const sub_category_id_list = await get_need_delete_id(sub_category_id);
            category_id_list.push(...sub_category_id_list);
        }
    }
    return category_id_list;
}

//删除分类和分类下的所有文章以及评论
async function delete_category_and_article_and_comment(id) {
    const t = await blog_type.sequelize.transaction();
    try {
        const category_id_list = await get_need_delete_id(id);
        if (category_id_list.length > 0) {
            //先找到所有文章id
            let article_ids = await article.findAll({
                attributes: ['id'],
                where: {
                    category_id: { [Op.in]: category_id_list },
                },
                transaction: t, //事务
            });
            article_ids = article_ids.map((item) => item.id);
            if (article_ids.length > 0) {
                //删除所有评论
                await comment.destroy({
                    where: {
                        article_id: { [Op.in]: article_ids },
                    },
                    transaction: t,
                });
                //删除所有文章
                await article.destroy({
                    where: {
                        id: { [Op.in]: article_ids },
                    },
                    transaction: t,
                });
                //删除所有分类
                await blog_type.destroy({
                    where: {
                        id: { [Op.in]: category_id_list },
                    },
                    transaction: t,
                });
                //提交事务
                await t.commit();
            }
        }
    } catch (error) {
        await t.rollback();
        console.error(error);
        throw error;
    }
}

//获取全部
module.exports.get_all = async function get_all() {
    return await blog_type.findAll();
};

//获取单个
module.exports.get_by_id = async function get_by_id(id) {
    return await blog_type.findByPk(id);
};

//更新
module.exports.update = async function update({ id = '', name = '', article_count = 0, order = '' } = {}) {
    return await blog_type.update(
        {
            name,
            article_count,
            order,
        },
        {
            where: {
                id,
            },
        }
    );
};

//添加
module.exports.add = async function add({ parent_id = null, name = '', article_count = 0, order = 1 } = {}) {
    return await blog_type.create({
        parent_id,
        name,
        article_count,
        order,
    });
};

//删除
module.exports.delete_by_id = async function delete_by_id(id) {
    return await delete_category_and_article_and_comment(id);
};

//article_cunt ++
module.exports.article_count_add = async function article_count_add(id) {
    return await blog_type.increment('article_count', {
        by: 1,
        where: { id },
    });
};

//article_cunt --
module.exports.article_count_sub = async function article_count_sub(id = '') {
    return await blog_type.decrement('article_count', {
        by: 1,
        where: { id },
    });
};
