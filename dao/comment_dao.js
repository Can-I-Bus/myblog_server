const comment = require('./domain/comment');
const article = require('./domain/article');
async function get_by_id(id) {
    return await comment.findByPk(id);
}

//获取comment
module.exports.get_comment = async function get_comment({
    id = '',
    article_id = '', // 新增文章ID参数
    page = 1,
    limit = 50,
} = {}) {
    // 如果传入了单个评论ID
    if (id !== '') {
        return await get_by_id(id);
    }

    // 处理分页参数
    const offset = (page * 1 - 1) * limit;
    const finalLimit = limit * 1;

    // 构建查询条件
    const where = {};
    if (article_id) {
        where.article_id = article_id;
    }

    return await comment.findAndCountAll({
        include: [
            {
                model: article,
                as: 'article',
                attributes: ['id', 'title'], // 按需获取文章字段
            },
        ],
        where, // 添加筛选条件
        offset,
        limit: finalLimit,
        order: [['created_at', 'DESC']], // 按时间倒序
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
