import { NextApiRequest, NextApiResponse } from "next";
import { getUserChart } from "../../../repositories/orders_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let { userId } = req.body;
        try {
            let chartUser = await getUserChart(userId);
            res.status(200).json({ status: "success", message: 'data fetched successfully!', data: chartUser });
        } catch (err) {
            console.log(err)
            res.status(200).json({ status: "error", message: 'something went wrong!' });
        }
    } else {
        res.status(405).json({ status: "error", message: "method not found!" });
    }
}
