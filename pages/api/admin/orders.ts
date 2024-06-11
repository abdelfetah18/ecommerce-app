import { NextApiRequest, NextApiResponse } from "next";
import { getOrders } from "../../../repositories/orders_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const orders = await getOrders();
        res.status(200).json({ status: "success", message: 'data fetched successfully!', data: orders });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: 'something went wrong!' });
    }
}
