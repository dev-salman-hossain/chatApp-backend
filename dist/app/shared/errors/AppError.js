class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code, stack = '') {
        super(message);
        this.statusCode = statusCode;
        if (code) {
            this.code = code;
        }
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map