const banner = require('./domain/banner');

//获取全部
module.exports.get_all = async function get_baneer_all() {
    return await banner.findAll();
};

//获取单个
module.exports.get_by_id = async function get_by_id(id) {
    console.log('get_by_id>>>', id);
    return await banner.findByPk(id);
};

//更新
module.exports.update = async function update_banner({ id = '', big_img = '', title = '', mid_img = '', description = '' } = {}) {
    console.log('update>>', id);
    return await banner.update(
        {
            big_img,
            mid_img,
            description,
            title,
        },
        {
            where: {
                id,
            },
        }
    );
};

//添加
module.exports.add = async function add_banner({ big_img = '', title = '', mid_img = '', description = '' } = {}) {
    return await banner.create({
        big_img,
        mid_img,
        title,
        description,
    });
};

//删除
module.exports.delete_by_id = async function delete_by_id(id = '') {
    return await banner.destroy({
        where: {
            id,
        },
    });
};
