import { decodeJwt } from "jose";
import { getUserOrders, getUserOrdersByState } from "../../../database/client";

export default async function handler(req, res){
    const user_session = decodeJwt(req.cookies.access_token || req.headers.authorization);
    const { state } = req.query;
    let orders = [];
    if(state){
        orders = await getUserOrdersByState(user_session.user_id, state);
    }else{
        orders = await getUserOrders(user_session.user_id);
    }
    res.status(200).json({ status: "success", data: orders });
}
