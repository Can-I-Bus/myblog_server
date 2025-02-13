const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { formatRes } = require('../utils/res');
const { login, update } = require('../dao/admin_dao');
const { ValidationError } = require('../utils/errors');

exports.login = async ({ login_id = '', login_pwd = '', rember = 1 } = {}, res) => {
    login_pwd = md5(login_pwd);
    rember = parseInt(rember);
    const admin = await login({ login_id, login_pwd });
    let result = {};
    if (admin?.dataValues) {
        result.data = {
            id: admin.dataValues.id,
            login_id: admin.dataValues.login_id,
            name: admin.dataValues.name,
        };
        // 生成token
        const token = jwt.sign(result.data, md5(process.env.JWT_SECRET), {
            expiresIn: 60 * 60 * 24 * rember,
        });
        result.token = token;
    } else {
        result.data = null;
    }
    return result;
};

exports.update = async ({ id = '', name = '', login_id = '', login_pwd = '', new_login_pwd = '' } = {}, res) => {
    login_pwd = md5(login_pwd);
    new_login_pwd = md5(new_login_pwd);
    const admin = await login({ login_id, login_pwd });
    console.log(admin);
    if (!admin?.dataValues) {
        throw new ValidationError('用户不存在或密码错误');
    } else {
        const result = await update({ id, name, new_login_pwd });
        if (result) {
            return formatRes(0, '修改成功', null);
        } else {
            return formatRes(1, '修改失败', null);
        }
    }
};
