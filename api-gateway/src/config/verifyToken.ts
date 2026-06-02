import jwt from "jsonwebtoken";

function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        return { 'token': 'valid token', 'payload': decoded, 'status': 200}
    } catch(err: any) {
        
        if (err.name === "TokenExpiredError") {
            return {
                status: 401,
                error: "TOKEN_EXPIRED",
                message: "jwt expired"
            };
        }

        if (err.name === "JsonWebTokenError") {
            return {
                status: 403,
                error: "INVALID_TOKEN",
                message: err.message
            };
        }

        return {
        status: 500,
        error: "UNKNOWN_ERROR"
        };
    }

}


export default verifyToken