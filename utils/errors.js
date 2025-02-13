// 自定义错误类
const { formatRes } = require('./res');
class ServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }

    toResJSON() {
        return formatRes(this.code, this.message, null);
    }
}

exports.ServiceError = ServiceError;

exports.UploadError = class extends ServiceError {
    constructor(message) {
        super(message, 413);
    }
};

exports.ForbiddenError = class extends ServiceError {
    constructor(message) {
        super(message, 401);
    }
};

exports.ValidationError = class extends ServiceError {
    constructor(message) {
        super(message, 406);
    }
};

exports.NotFoundError = class extends ServiceError {
    constructor() {
        super('资源不存在', 404);
    }
};

exports.UnKnowError = class extends ServiceError {
    constructor() {
        super('服务器错误', 500);
    }
};
