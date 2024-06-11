import { JWTVerifyResult, decodeJwt, jwtVerify } from "jose";
import { getUserWithEmail, getUserWithEmailById, updateUser } from "../../../repositories/users_repository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const user: User = req.body;

        await updateUser(user);

        res.status(200).json({ status: "success", message: "Your user information has been updated.", data: user });
    } else {
        const accessToken = req.headers.authorization;
        const token: JWTVerifyResult = await jwtVerify(accessToken, Buffer.from(process.env.JWT_SECRET), { algorithms: ["HS256"] });
        const user = token.payload;
        if (user.role == "guest") {
            res.status(200).json({ status: "success", data: user });
            return;
        }

        const userWithEmail = await getUserWithEmailById(user._id as string);
        res.status(200).json({ status: "success", data: userWithEmail });
    }
}
