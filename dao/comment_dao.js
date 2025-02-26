const comment = require('./domain/comment');
const article = require('./domain/article');
async function get_by_id(id) {
    return await comment.findByPk(id);
}

//获取comment
module.exports.get_comment = async function get_comment({ id = '', page = 1, limit = 50 } = {}) {
    if (id !== '') {
        return await get_by_id(id);
    }
    page = (page * 1 - 1) * limit;
    limit = limit * 1;
    return await comment.findAndCountAll({
        include: [{ model: article, as: 'article' }],
        offset: page,
        limit,
    });
};

//获取单个
module.exports.get_by_id = get_by_id;

//添加
module.exports.add = async function add(comment_info) {
    return await comment.create(comment_info);
};

//删除
module.exports.delete_by_id = async function delete_by_id(id) {
    return await comment.destroy({
        where: {
            id,
        },
    });
};

//根据article_id删除
module.exports.delete_by_article_id = async function delete_by_article_id(article_id) {
    return await comment.destroy({
        where: {
            article_id,
        },
    });
};
