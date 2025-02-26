const article = require('./domain/article');
const blog_type = require('./domain/blog_type');
const comment = require('./domain/comment');

async function add_scan_number(id) {
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
        const result = await article.findByPk(id);
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
    category_id = '',
} = {}) {
    return await article.create({
        title,
        description,
        toc,
        html_content,
        thumb,
        scan_number,
        comment_number,
        category_id,
    });
};

//删除
module.exports.delete_by_id = async function delete_by_id(id) {
    const t = await article.sequelize.transaction(); //开启事务
    try {
        //找到所有评论并删除
        await comment.destroy({
            where: { article_id: id },
            transaction: t,
        });
        //删除文章
        const result = await article.destroy({
            where: { id },
            transaction: t,
        });
        //找到对应的分类id
        const category_id = await article.findByPk(id, {
            attributes: ['category_id'],
        });
        //对应的分类文章数-1
        await blog_type.decrement('article_count', {
            by: 1,
            where: { id: category_id.category_id },
            transaction: t,
        });
        await t.commit(); //提交事务
        return result;
    } catch (error) {
        await t.rollback();
        console.error(error);
        throw error;
    }
};

//根据分类id来删除文章
module.exports.delete_by_category_id = async function delete_by_category_id(category_id) {
    return await article.destroy({
        where: {
            category_id,
        },
    });
};

//根据Id获取category_di
module.exports.get_category_id_by_id = async function get_category_id_by_id(id) {
    return await article.findByPk(id, {
        attributes: ['category_id'],
    });
};
