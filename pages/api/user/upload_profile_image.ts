import { Formidable } from "formidable";
import { uploadImage } from "../../../database/client";
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
                const imageFile = files["profileImage"][0];
                const imageAsset = await uploadImage(imageFile.filepath);
                res.status(200).json({ status: "success", message: "Profile Image uploaded successfully", data: imageAsset.image });
            }
        });
    } else {
        res.status(405).json({ status: "error", message: "Method not found" });
    }
}