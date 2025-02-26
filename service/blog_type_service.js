const { get_all, get_by_id, update, add, delete_by_id } = require('../dao/blog_type_dao');
const { delete_by_category_id: delete_article_by_category_id } = require('../dao/article_dao');
const { formatRes } = require('../utils/res');
const { NotFoundError } = require('../utils/errors');

const is_type_exist = async (id) => {
    const type = await get_by_id(id);
    if (!type?.dataValues) {
        throw new NotFoundError('分类不存在').toResJSON();
    }
    return true;
};

const get_tree_list = (list) => {
    const map = new Map();
    const result = [];

    // 先将所有项存入 Map，方便快速查找
    list.forEach((item) => map.set(item.id, { ...item, children: [] }));

    // 遍历 list，将每个子项归入其父项的 `children`
    list.forEach((item) => {
        if (item.parent_id === null) {
            // 根节点
            result.push(map.get(item.id));
        } else {
            // 如果父级存在，则加入其 `children` 数组
            const parent = map.get(item.parent_id);
            if (parent) {
                parent.children.push(map.get(item.id));
            }
        }
    });

    return result;
};

exports.get_blog_type_list = async function get_blog_type_list() {
    const blog_type_list = (await get_all()).map((i) => {
        return i.dataValues;
    });

    const result = get_tree_list(blog_type_list);

    return formatRes(0, 'ok', result);
};

exports.update_blog_type = async function update_blog_type({ id = '', name = '', article_count = 0, order = 1 } = {}) {
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

exports.add_blog_type = async function add_blog_type({ parent_id = null, name = '', article_count = 0, order = 1 } = {}) {
    const result = await add({ name, article_count, order, parent_id });
    if (!result?.dataValues) {
        return formatRes(1, '添加失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_blog_type = async function delete_blog_type(id) {
    await is_type_exist(id);
    const result = await delete_by_id(id);
    if (!result) {
        return formatRes(1, '删除失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};
