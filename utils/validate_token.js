const jwt = require('jsonwebtoken');
const md5 = require('md5');

module.exports.validateToken = (token) => {
    const res = jwt.verify(token, md5(process.env.JWT_SECRET));
    return res;
};
