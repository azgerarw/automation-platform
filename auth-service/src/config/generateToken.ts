import jwt from "jsonwebtoken";

function generateToken(user_id: string) {
    const token = jwt.sign(
    { userId: user_id, role: "user" },
        `${process.env.JWT_SECRET}`,
    { expiresIn: "1h" }
    );

    return token
}

export default generateToken