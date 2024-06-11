import { NextApiRequest, NextApiResponse } from "next";
import { getLastOrders } from "../../../repositories/orders_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const lastOrders = await getLastOrders();
        res.status(200).json({ status: "success", message: 'data fetched successfully!', data: lastOrders });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: 'something went wrong!' });
    }
}
