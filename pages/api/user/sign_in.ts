import bcrypt from "bcrypt";
import { serialize } from 'cookie';
import { SignJWT } from "jose";
import { getUserByUsername, getUserWithPassword } from "../../../repositories/users_repository";

export default async function handler(req: any, res: any) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        const user = await getUserWithPassword(username);
        if (!user) {
            res.status(200).json({ status: "error", message: "User not found" });
            return;
        }

        const is_valid = bcrypt.compareSync(password, user.password);
        if (!is_valid) {
            res.status(200).json({ status: "error", message: "Something wrong with your password!" });
            return;
        }

        const payload = { _id: user._id, username, email: user.email, role: user.role, profile_image: user.profile_image };
        const jwtSigner = new SignJWT(payload);

        jwtSigner.setProtectedHeader({ alg: "HS256", b64: true });
        jwtSigner.setExpirationTime("24h");

        const jwtSecret = Buffer.from(process.env.JWT_SECRET);
        const accessToken = await jwtSigner.sign(jwtSecret);

        let _user = await getUserByUsername(username);
        res.status(200).json({ status: "success", message: "Sign-in successful! Welcome back!", data: { access_token: accessToken, user: _user } });
    } else {
        res.status(405).send("Method Not Allowed!");
    }
}
