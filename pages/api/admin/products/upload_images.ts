import { Formidable } from "formidable";
import { uploadImage } from "../../../../database/client";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: false
    }
};

export default function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let form = new Formidable();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(200).json({ status: "error", message: "something went wrong!" });
            } else {
                let images = [];
                const uploadedImages = files["images"];
                for (let i = 0; i < uploadedImages.length; i++) {
                    let asset = await uploadImage(uploadedImages[i].filepath);
                    images.push(asset.image);
                }

                res.status(200).json({ status: "success", message: "uploaded successfuly!", data: images });
            }
        });
    } else {
        res.status(405).json({
            status: "error",
            message: "method not found!"
        });
    }
}