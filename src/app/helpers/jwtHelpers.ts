import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'


const createToken = (
    payload: Record<string, unknown>,
    secret: string,
    expireTime: SignOptions['expiresIn']
): string => {
    return jwt.sign(payload, secret, {
        expiresIn: expireTime
    })
}

const verifyToken = (token: string, secret: string): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload
}

export const jwtHelpers = {
    createToken,
    verifyToken
}