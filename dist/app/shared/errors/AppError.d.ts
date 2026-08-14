declare class AppError extends Error {
    statusCode: number;
    code?: string;
    constructor(statusCode: number, message: string, code?: string, stack?: string);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map