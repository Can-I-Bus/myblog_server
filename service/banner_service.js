const { get_all, get_by_id, update, add, delete_by_id } = require('../dao/banner_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_banner_exist = async (id) => {
    const banner = await get_by_id(id);
    if (!banner?.dataValues) {
        throw new NotFoundError('banner不存在').toResJSON();
    }
    return true;
};

exports.get_banner_list = async function get_banner_list() {
    const banner_list = await get_all();
    if (!banner_list) {
        return formatRes(1, '获取banner列表失败', null);
    } else {
        return formatRes(0, 'ok', banner_list);
    }
};

exports.update_banner = async function update_banner({ id = '', title = '', big_img = '', mid_img = '', description = '' } = {}) {
    if (id === '') {
        return formatRes(1, '请输入要更新的banner id', null);
    }
    await is_banner_exist(id);
    const result = await update({ id, title, big_img, mid_img, description });
    if (!result) {
        return formatRes(1, '更新banner失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.add_banner = async function add_banner({ title = '', big_img = '', mid_img = '', description = '' } = {}) {
    const result = await add({ title, big_img, mid_img, description });
    if (!result?.dataValues) {
        return formatRes(1, '添加banner失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_banner = async function delete_banner(id) {
    await is_banner_exist(id);
    const result = await delete_by_id(id);
    console.log(result);
    if (!result) {
        return formatRes(1, '删除banner失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
