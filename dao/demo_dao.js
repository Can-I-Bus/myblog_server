const demo = require('./domain/demo');

async function get_by_id(id) {
    console.log('get_by_id>>>', id);
    return await demo.findByPk(id);
}

//获取demo
module.exports.get_demo = async function get_demo({ id = '', page = 1, limit = 50 } = {}) {
    if (id !== '') {
        return await get_by_id(id);
    }
    page = (page * 1 - 1) * limit;
    limit = limit * 1;
    return await demo.findAndCountAll({
        offset: page,
        limit,
    });
};

//获取单个
module.exports.get_by_id = get_by_id;

//更新
module.exports.update = async function update(id, new_demo_info) {
    console.log('update>>', id);
    return await demo.update(
        new_demo_info,

        {
            where: {
                id,
            },
        }
    );
};

//添加
module.exports.add = async function add(demo_info) {
    return await demo.create(demo_info);
};

//删除
module.exports.delete_by_id = async function delete_by_id(id) {
    return await demo.destroy({
        where: {
            id,
        },
    });
};
