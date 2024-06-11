import { Formidable } from "formidable";
import { uploadImage } from "../../../../database/client";
import { getLayoutContentByName, updateLayoutContent } from "../../../../repositories/layout_contents_repository";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: false
    }
};

export default function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const form = new Formidable();
        form.parse(req, async (err, _, files) => {
            if (err) {
                res.status(200).json({ status: "error", message: "something went wrong!" });
            } else {
                const logoFile = files["image"][0];
                const imageAsset = await uploadImage(logoFile.filepath);
                const bannerImageLayout = await getLayoutContentByName('banner_image');
                await updateLayoutContent({ ...bannerImageLayout, image: imageAsset.image });
                res.status(200).json({ status: "success", message: "Banner Image updated successfully", data: { ...bannerImageLayout, image: imageAsset.image } });
            }
        });
    } else {
        res.status(405).json({ status: "error", message: "Method not found" });
    }
}