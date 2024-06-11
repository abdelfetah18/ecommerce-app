import { getProducts, getProductsByCategoryId } from "../../repositories/products_repository";

export default async function handler(req, res) {
    if (req.query.category_id) {
        try {
            let products = await getProductsByCategoryId(req.query.category_id);
            res.status(200).json({ status: "success", data: products });
        } catch (err) {
            res.status(200).json({ status: "error", message: "Something went wrong!", error: err });
        }
    } else {
        try {
            let products = await getProducts();
            res.status(200).json({ status: "success", data: products });
        } catch (err) {
            res.status(200).json({ status: "error", message: "Something went wrong!", error: err });
        }
    }
}
