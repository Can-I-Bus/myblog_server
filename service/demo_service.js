const { get_demo, get_by_id, update, add, delete_by_id } = require('../dao/demo_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_demo_exist = async (id) => {
    const banner = await get_by_id(id);
    if (!banner?.dataValues) {
        throw new NotFoundError('demo不存在').toResJSON();
    }
    return true;
};

exports.get_demo_list = async function get_demo_list({ id, page, limit }) {
    const demo_list = await get_demo({ id, page, limit });
    return formatRes(0, 'ok', demo_list);
};

exports.update_demo = async function update_demo(id, new_demo_info) {
    if (id === '') {
        return formatRes(1, '请输入要更新的demo id', null);
    }
    await is_demo_exist(id);
    const result = await update(new_demo_info);
    if (!result) {
        return formatRes(1, '更新demo失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.add_demo = async function add_demo(new_demo_info) {
    const result = await add(new_demo_info);
    if (!result?.dataValues) {
        return formatRes(1, '添加demo失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_demo = async function delete_demo(id) {
    await is_demo_exist(id);
    const result = await delete_by_id(id);
    if (!result) {
        return formatRes(1, '删除demo失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
