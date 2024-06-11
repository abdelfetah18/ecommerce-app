import { NextApiRequest, NextApiResponse } from "next";
import { createPrice } from "../../../../repositories/prices_repository";
import { updateProduct } from "../../../../repositories/products_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == "POST") {
            let product: Product = req.body;
            let price = product.price;
            if (price._id == undefined) {
                price = await createPrice(product.price);
            }

            const newProduct = await updateProduct({ ...product, price });

            res.status(200).json({ status: "success", message: "Product updated successfully", data: newProduct });
        } else {
            res.status(405).json({ status: "error", message: "method not found!" });
        }
    } catch (err) {
        console.log("updateProduct", err);
        res.status(405).json({ status: "error", message: "Something went wrong" });
    }
}