const { get_all, get_by_id, update, add, delete_by_id } = require('../dao/blog_type_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_type_exist = async (id) => {
    const type = await get_by_id(id);
    if (!type?.dataValues) {
        throw new NotFoundError('分类不存在').toResJSON();
    }
    return true;
};

exports.get_blog_type_list = async function get_blog_type_list() {
    const blog_type_list = await get_all();
    if (!blog_type_list) {
        return formatRes(1, '分类列表为空', null);
    } else {
        return formatRes(0, 'ok', blog_type_list);
    }
};

exports.update_blog_type = async function update_blog_type({ id = '', name = '', article_count = 0, order = '' } = {}) {
    if (id === '') {
        return formatRes(1, '请输入要更新的分类 id', null);
    }
    await is_type_exist(id);
    const result = await update({ id, name, article_count, order });
    if (!result) {
        return formatRes(1, '更新博客分类失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.add_blog_type = async function add_blog_type({ name = '', article_count = 0, order = '' } = {}) {
    const result = await add({ name, article_count, order });
    if (!result?.dataValues) {
        return formatRes(1, '添加失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_blog_type = async function delete_blog_type(id) {
    await is_type_exist(id);
    const result = await delete_by_id(id);
    console.log(result);
    if (!result) {
        return formatRes(1, '删除失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
