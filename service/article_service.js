const { get_article, update, add, delete_by_id, add_scan_number } = require('../dao/article_dao');
const { article_count_add, article_count_sub } = require('../dao/blog_type_dao');
const { formatRes } = require('../utils/res');
const { formatToc } = require('../utils/toc');
const { NotFoundError } = require('../utils/errors');

const is_article_exist = async (id) => {
    const atcile = await get_article(id);
    if (!atcile) {
        throw new NotFoundError('文章不存在').toResJSON();
    }
    return true;
};

exports.get_records = async function get_records({ id = '', page = 1, limit = 50, category_id = '', token = '' } = {}) {
    const blog_type_list = await get_article({ id, page, limit, category_id, token });
    return formatRes(0, 'ok', blog_type_list);
};

exports.update_article = async function update_article(new_article_info) {
    if (new_article_info?.id === '' || !new_article_info?.id) {
        return formatRes(1, '请输入要更新的文章 id', null);
    }
    await is_article_exist(new_article_info.id);
    const { tree, html } = formatToc(new_article_info.markedown_content);
    new_article_info.toc = JSON.stringify(tree);
    new_article_info.html_content = html;
    const result = await update(new_article_info.id, new_article_info);
    if (!result) {
        return formatRes(1, '更新失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.add_article = async function add_article({
    title = '',
    description = '',
    toc = [],
    html_content = '',
    thumb = '',
    scan_number = 0,
    comment_number = 0,
    markedown_content = '',
    category_id = '',
} = {}) {
    const { tree, html } = formatToc(markedown_content);
    toc = JSON.stringify(tree);
    html_content = html;
    const result = await add({ title, description, toc, html_content, thumb, scan_number, comment_number, category_id });
    await article_count_add(category_id);
    if (!result?.dataValues) {
        return formatRes(1, '添加失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.delete_article = async function delete_article(id) {
    await is_article_exist(id);
    const result = await delete_by_id(id);
    //根据文章id获取category_id
    const article = await get_article(id);
    //文章分类下的总量--
    await article_count_sub(article.category_id);
    if (!result) {
        return formatRes(1, '删除失败', null);
    } else {
        return formatRes(0, 'ok', null);
    }
};

exports.add_article_scan_number = async function add_article_scan_number(id) {
    await is_article_exist(id);
    const result = await add_scan_number(id);
    if (result?.[0]?.[1] > 0) {
        return formatRes(0, 'ok', null);
    } else {
        return formatRes(1, '添加失败', null);
    }
};
