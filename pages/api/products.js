import { getProducts, getProductsByCategory } from "../../database/client";

export default async function handler(req, res) {
    if(req.query.category){
        try {
            let products = await getProductsByCategory(req.query.category);
            res.status(200).json({ status:"success", data: products });
        } catch(err){
            res.status(200).json({ status:"error", message:"Something went wrong!", error: err });
        }
    }else{
        try {
            let products = await getProducts();
            res.status(200).json({ status:"success", data: products });
        } catch(err){
            res.status(200).json({ status:"error", message:"Something went wrong!",error:err });
        }
    }
}
  