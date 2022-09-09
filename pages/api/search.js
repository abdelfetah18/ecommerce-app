import { getData } from "../../database/client";

export default async function handler(req, res) {
    try {
        var query = req.query;
        var result = await getData('*[_type=="products" && name match $name || category->name match $name]{_id,name,"images":images[]{"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]}',{ name:query.q+"*" });
    } catch (err) {
        res.status(200).json({
            status:"error",
            message:"something went wrong!"
        });
    } finally {
        res.status(200).json({
            status:"success",
            message:"found the following products",
            data:result
        });
    }
}
  