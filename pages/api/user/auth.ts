import { jwtVerify } from "jose";

export default async function handler(req: any, res: any) {
    try {
        const secret = Buffer.from(process.env.JWT_SECRET);
        const accessToken = req.headers.get("authorization");
        await jwtVerify(accessToken, secret, { algorithms: ["HS256"] });
        res.status(200).json({ success: 'success', data: { access_token: accessToken } });
    } catch (err) {
        console.log(err);
        res.status(200).json({ success: 'error', message: 'Something went wrong' });
    }
}