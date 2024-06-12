import { NextApiRequest, NextApiResponse } from "next";
import { getCategories } from "../../repositories/categories_repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        let categories = await getCategories();
        res.status(200).json({ status: "success", data: categories });
    } catch (err) {
        res.status(200).json({ status: "error", message: "Something went wrong!", error: err });
    }
};
