const article = require('./domain/article');
const blog_type = require('./domain/blog_type');

async function add_scan_number(id = '') {
    await article.increment('scan_number', {
        by: 1,
        where: { id },
    });
}

//获取文章
module.exports.get_article = async function get_article({ id = '', page = 1, limit = 50, category_id = '', token = '' } = {}) {
    page = (page * 1 - 1) * limit;
    limit = limit * 1;
    if (id !== '' && id !== null && id !== undefined) {
        const result = (await article.findByPk(id)?.dataValues) ?? null;
        if (token === '') {
            await add_scan_number(id);
        }
        if (result) {
            result.toc = JSON.parse(result.toc);
        }
        return result;
    } else if (category_id === '' || category_id === null) {
        const result = await article.findAndCountAll({
            include: [{ model: blog_type, as: 'category' }],
            offset: page,
            limit,
        });
        if (result?.rows) {
            result.rows.forEach((item) => {
                item.toc = JSON.parse(item.toc);
            });
        }
        return result;
    } else {
        const result = await article.findAndCountAll({
            include: [{ model: blog_type, as: 'category' }],
            offset: page,
            limit: limit,
            where: {
                category_id,
            },
        });
        if (result?.rows) {
            result.rows.forEach((item) => {
                item.toc = JSON.parse(item.toc);
            });
        }
        return result;
    }
};

//更新
module.exports.update = async function update(id, new_article_info) {
    return await article.update(new_article_info, {
        where: {
            id,
        },
    });
};

//添加
module.exports.add = async function add({
    title = '',
    description = 0,
    toc = '',
    html_content = '',
    thumb = '',
    scan_number = '',
    comment_number = 0,
} = {}) {
    return await article.create({
        title,
        description,
        toc,
        html_content,
        thumb,
        scan_number,
        comment_number,
    });
};

//删除
module.exports.delete_by_id = async function delete_by_id(id = '') {
    return await article.destroy({
        where: {
            id,
        },
    });
};
