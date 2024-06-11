import { NextApiRequest, NextApiResponse } from "next";
import { createCategory } from "../../../../repositories/categories_repository";


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let category: Category = req.body;
        const newCategory = await createCategory(category);

        res.status(200).json({
            status: "success",
            message: "new category added successfuly!",
            data: newCategory
        });
    } else {
        res.status(405).json({
            status: "error",
            message: "method not found!"
        });
    }
}