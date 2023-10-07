import { getCategories } from "../../database/client";

export default async function handler(req, res) {
    try {
        let categories = await getCategories();
        res.status(200).json({ status:"success", data: categories });
    } catch(err){
        res.status(200).json({ status:"error", message:"Something went wrong!",error:err });
    }
};
  