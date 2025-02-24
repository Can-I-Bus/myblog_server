const blog_type = require('./domain/blog_type');
const article = require('./domain/article');

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
module.exports.delete_by_id = async function delete_by_id(id = '') {
    const result = await blog_type.destroy({
        where: {
            id,
        },
    });
    //同时删除该分类下的所有文章
    await article.destroy({
        where: {
            category_id: id,
        },
    });
    return result;
};

//article_cunt ++
module.exports.article_count_add = async function article_count_add(id = '') {
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
