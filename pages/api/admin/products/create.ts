import { NextApiRequest, NextApiResponse } from "next";
import { createPrice } from "../../../../repositories/prices_repository";
import { createProduct } from "../../../../repositories/products_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let product: Product = req.body;

        const price = await createPrice(product.price);
        const newProduct = await createProduct({ ...product, price });

        res.status(200).json({ status: "success", message: "added successfuly!", data: newProduct });
    } else {
        res.status(405).json({
            status: "error",
            message: "method not found!"
        });
    }
}