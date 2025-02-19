const message = require('./domain/message');

async function get_by_id(id) {
    return await message.findByPk(id);
}

//获取message
module.exports.get_message = async function get_message({ id = '', page = 1, limit = 50 } = {}) {
    if (id !== '') {
        return await get_by_id(id);
    }
    page = (page * 1 - 1) * limit;
    limit = limit * 1;
    return await message.findAndCountAll({
        offset: page,
        limit,
    });
};

//获取单个
module.exports.get_by_id = get_by_id;

//添加
module.exports.add = async function add(message_info) {
    return await message.create(message_info);
};

//删除
module.exports.delete_by_id = async function delete_by_id(id) {
    return await message.destroy({
        where: {
            id,
        },
    });
};
