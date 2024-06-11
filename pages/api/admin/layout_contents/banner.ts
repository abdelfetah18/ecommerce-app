import { NextApiRequest, NextApiResponse } from "next";
import { getBannerLayoutContent } from "../../../../repositories/layout_contents_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const bannerLayoutContent = await getBannerLayoutContent();
        res.status(200).json({ status: "success", message: 'Banner layout fetched successfully', data: bannerLayoutContent });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: 'something went wrong!' });
    }
}
