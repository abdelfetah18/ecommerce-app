import { NextApiRequest, NextApiResponse } from "next";
import { getLayoutContentByName } from "../../../../repositories/layout_contents_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name } = req.query;
        const layoutContent = await getLayoutContentByName(name as string);
        res.status(200).json({ status: "success", message: 'data fetched successfully!', data: layoutContent });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: 'something went wrong!' });
    }
}
