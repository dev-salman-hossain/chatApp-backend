import { StatusCodes } from 'http-status-codes';
export const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        error: {
            statusCode: StatusCodes.NOT_FOUND,
        },
    });
};
//# sourceMappingURL=notFound.js.map