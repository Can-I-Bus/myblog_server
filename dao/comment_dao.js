const comment = require('./domain/comment');

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
