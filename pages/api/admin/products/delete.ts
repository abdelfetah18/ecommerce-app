import { NextApiRequest, NextApiResponse } from "next";
import { deletePrice } from "../../../../repositories/prices_repository";
import { deleteProduct, getProductById } from "../../../../repositories/products_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        let { productId } = req.body;
        try {
            const product = await getProductById(productId);
            if (!product) {
                res.status(200).json({ status: "error", message: "Unable to delete product. because it does not exist." });
            }

            await deleteProduct(productId);
            await deletePrice(product.price._id);

            res.status(200).json({ status: "success", message: "Product deleted successfully" });
        } catch (err) {
            console.log({ err });
            res.status(200).json({ status: "error", message: "Unable to delete product." });
        }
    } else {
        res.status(405).json({
            status: "error",
            message: "method not found!"
        });
    }
}