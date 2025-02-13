const admin = require('./domain/admin');
const md5 = require('md5');
//登陆
module.exports.login = async function login({ login_id = '', login_pwd = '' } = {}) {
    login_pwd = md5(login_pwd);
    return await admin.findOne({
        where: {
            login_id,
            login_pwd,
        },
    });
};

module.exports.update = async function update({ id = '', name = '', new_login_pwd = '' } = {}) {
    return await admin.update(
        {
            name,
            login_pwd: md5(new_login_pwd),
        },
        {
            where: {
                id,
            },
        }
    );
};
