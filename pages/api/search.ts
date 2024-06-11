import { getProductsByFilters } from "../../repositories/products_repository";

export default async function handler(req, res) {
    try {
        let { query, filters } = req.body;
        let data = await getProductsByFilters(query, filters);
        res.status(200).json({ status: "success", message: "found the following products", data });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status: "error", message: "something went wrong!" });
    }
}
