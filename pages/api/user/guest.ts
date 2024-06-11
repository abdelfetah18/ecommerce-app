import { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose";
import * as crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user: User = { _id: crypto.randomUUID(), username: 'Guest', email: 'guest@guest.com', role: 'guest' };
    const payload = { ...user };
    const jwtSigner = new SignJWT(payload);

    jwtSigner.setProtectedHeader({ alg: "HS256", b64: true });
    jwtSigner.setExpirationTime("24h");

    const accessToken = await jwtSigner.sign(Buffer.from(process.env.JWT_SECRET));

    res.status(200).json({ status: "success", message: "Sign In as guest success.", data: { access_token: accessToken, user } });

}
