import { getUserWithPassword } from "../../../database/client";
import bcrypt from "bcrypt";
import { PrivateKey } from "../../../gloabal";
import { serialize } from 'cookie';
import { SignJWT, importPKCS8 } from "jose";

export default async function handler(req, res) {
    if(req.method === "POST"){
        let { username, password } = req.body;
        let user = await getUserWithPassword(username);
        if(!user)
            return;
        
        const is_valid = bcrypt.compareSync(password, user.password);
        if(!is_valid)
            res.status(200).json({ status:"error", message:"Something wrong with your password!" });
        
        let payload = { user_id: user._id, username, email: user.email, role: user.role, profile_image: user.profile_image };
        let jwtSigner = new SignJWT(payload);
        
        jwtSigner.setProtectedHeader({ alg:"RS256", b64:true });
        jwtSigner.setExpirationTime("24h");
        
        let key = await importPKCS8(PrivateKey,"RS256");
        let encoded = await jwtSigner.sign(key);

        res.setHeader('Set-Cookie', serialize('access_token', encoded, { path:"/" }));
        res.status(200).json({ status:"success", message:"Sign in successfuly!", access_token: encoded });
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}
