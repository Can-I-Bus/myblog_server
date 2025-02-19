const { get_message, get_by_id, add, delete_by_id } = require('../dao/message_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_message_exist = async (id) => {
    const banner = await get_by_id(id);
    if (!banner?.dataValues) {
        throw new NotFoundError('message不存在').toResJSON();
    }
    return true;
};

exports.get_message_list = async function get_message_list() {
    const message_list = await get_message();
    return formatRes(0, 'ok', message_list);
};

exports.add_message = async function add_message(new_message_info) {
    const result = await add(new_message_info);
    if (!result?.dataValues) {
        return formatRes(1, '添加message失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_message = async function delete_message(id) {
    await is_message_exist(id);
    const result = await delete_by_id(id);
    if (!result) {
        return formatRes(1, '删除message失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
