import { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "../../../../repositories/products_repository";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let { product_id } = req.query;

    const product = await getProductById(product_id as string || '');

    res.status(200).json({ status: "success", message: "added successfuly!", data: product });
}