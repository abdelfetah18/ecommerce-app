import { jwtVerify } from "jose";
import { getUserOrders, getUserOrdersByState } from "../../../repositories/orders_repository";

export default async function handler(req, res) {
    const accessToken = req.headers.authorization;
    const jwtSecret = Buffer.from(process.env.JWT_SECRET);
    const jwtVerifyResult = await jwtVerify(accessToken, jwtSecret, { algorithms: ["HS256"] });
    const user = jwtVerifyResult.payload;

    const { state } = req.query;
    let orders = [];
    if (state) {
        orders = await getUserOrdersByState(user._id as string, state);
    } else {
        orders = await getUserOrders(user._id as string);
    }
    res.status(200).json({ status: "success", data: orders });
}
