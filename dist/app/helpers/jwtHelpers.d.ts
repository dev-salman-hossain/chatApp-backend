import { JwtPayload, SignOptions } from 'jsonwebtoken';
declare const createToken: (payload: Record<string, unknown>, secret: string, expireTime: SignOptions['expiresIn']) => string;
declare const verifyToken: (token: string, secret: string) => JwtPayload;
export declare const jwtHelpers: {
    createToken: typeof createToken;
    verifyToken: typeof verifyToken;
};
export {};
//# sourceMappingURL=jwtHelpers.d.ts.map