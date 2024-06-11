import { NextApiRequest, NextApiResponse } from "next";
import { getDashboardStats } from "../../../database/client";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const dashboardStats = await getDashboardStats();
        res.status(200).json({ status: "success", message: 'data fetched successfully!', data: dashboardStats });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: 'something went wrong!' });
    }
}
