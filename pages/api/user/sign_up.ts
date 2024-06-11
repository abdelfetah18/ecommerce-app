import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "../../../repositories/users_repository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!(req.method === "POST")) {
        res.status(200).json({ status: "error", message: "Method not found" });
    }

    const { username, email, password } = req.body;
    if (!(username.length > 0 && email.length > 0 && password.length > 0 && isValidEmail(email))) {
        res.status(200).json({ status: "error", message: "Invalid input" });
        return;
    }

    const user = await getUserByUsername(username);
    if (user) {
        res.status(200).json({ status: "error", message: "username already in use" });
        return;
    }

    const salt = await bcrypt.genSalt(Math.floor(Math.random() * 10));
    const hashed_pwd = await bcrypt.hash(password, salt);

    await createUser({ username, email, password: hashed_pwd });

    res.status(200).json({ status: "success", message: "Welcome to the family! Your sign-up was successful. Happy shopping!" });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}