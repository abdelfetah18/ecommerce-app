import { NextApiRequest, NextApiResponse } from "next";
import { updateBannerLayoutContent } from "../../../../repositories/layout_contents_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("req.method:", req.method);
        if (req.method == "POST") {
            const bannerLayout: BannerLayout = req.body;
            console.log({ bannerLayout });
            const newBannerLayout = await updateBannerLayoutContent({ ...bannerLayout });
            res.status(200).json({ status: "success", message: "Banner updated successfully", data: newBannerLayout });
        } else {
            res.status(405).json({ status: "error", message: "method not found!" });
        }
    } catch (err) {
        console.log("updateBannerLayout", err);
        res.status(405).json({ status: "error", message: "Something went wrong" });
    }
}