const { get_all, get_by_id, update, add, delete_by_id } = require('../dao/blog_type_dao');
const { get_article } = require('../dao/article_dao');
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

exports.get_blog_type_list = async function get_blog_type_list(query) {
    const { need_article = false, category_id = '' } = query;
    let result;
    let blog_type_list;
    if (category_id === '') {
        blog_type_list = (await get_all({ where: { id: category_id } })).map((i) => {
            return i.dataValues;
        });
    } else {
        blog_type_list = await get_by_id(category_id);
    }
    if (!need_article) {
        result = get_tree_list(blog_type_list);
    } else {
        let _result = [];
        for (let i = 0; i < blog_type_list.length; i++) {
            let item = blog_type_list[i];
            const _article_list = await get_article({ category_id: item.id, limit: 10, page: 1 });
            item = { ...item, article_list: _article_list.rows };
            _result.push(item);
        }

        result = get_tree_list(_result);
    }

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
