import { createUser, getUser } from "../../../database/client";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if(!(req.method === "POST"))
        res.status(200).json({ status: "error", message: "method not found" });
    
    let { username, email, password } = req.body;
    if(!(username.length > 0 && email.length > 0 && password.length > 0 && isValidEmail(email)))
        res.status(200).json({ status: "error", message: "invalid input" });
    
    let user = await getUser(username);
    if(user)
        res.status(200).json({ status: "error", message: "username already used!" });

    let salt = await bcrypt.genSalt(Math.floor(Math.random() * 10));
    let hashed_pwd = await bcrypt.hash(password, salt);

    let user_doc = { _type:"users", username, email, password: hashed_pwd, role:"user", email_verify: false, sign_up_with: "email" };
    let new_user = await createUser(username, email, hashed_pwd);
    
    res.status(200).json({ status:"success", message:"user signed up successfuly!" });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}