import { NextApiRequest, NextApiResponse } from "next";
import { deleteCategory } from "../../../../repositories/categories_repository";


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let { categoryId } = req.body;
        try {
            await deleteCategory(categoryId);
            res.status(200).json({ status: "success", message: "Category deleted successfully" });
        } catch (err) {
            res.status(200).json({ status: "error", message: "Unable to delete category due to attached products." });
        }
    } else {
        res.status(405).json({
            status: "error",
            message: "method not found!"
        });
    }
}