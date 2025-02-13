const svgCaptcha = require('svg-captcha');

module.exports.getCaptcha = async (req, res) => {
    return svgCaptcha.create({
        size: 4, // 验证码长度
        ignoreChars: '0o1ilO', // 验证码字符中排除 0o1ilO
        noise: 6, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    });
};
