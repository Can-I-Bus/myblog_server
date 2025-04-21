const { get_comment, get_by_id, add, delete_by_id } = require('../dao/comment_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_comment_exist = async (id) => {
    const banner = await get_by_id(id);
    if (!banner?.dataValues) {
        throw new NotFoundError('comment不存在').toResJSON();
    }
    return true;
};

exports.get_comment_list = async function get_comment_list(comment_query_info) {
    const comment_list = await get_comment(comment_query_info);
    return formatRes(0, 'ok', comment_list);
};

exports.add_comment = async function add_comment(new_comment_info) {
    const result = await add(new_comment_info);
    if (!result?.dataValues) {
        return formatRes(1, '添加comment失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_comment = async function delete_comment(id) {
    await is_comment_exist(id);
    const result = await delete_by_id(id);
    if (!result) {
        return formatRes(1, '删除comment失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
