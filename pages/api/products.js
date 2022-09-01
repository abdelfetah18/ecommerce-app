import { getData } from "../../database/client";

export default function handler(req, res) {
    getData('*[_type=="products"]{_id,name,"images":images[]{"url":asset->url},"category":*[_type=="categories" && @._id==^.category._ref][0],description,"price":*[_type=="prices" && @._id==^.price._ref][0]}',{}).then((result) => {
        res.status(200).json({ status:"success", data: result });
    }).catch((err) => {
        res.status(200).json({ status:"error", message:"Something went wrong!",error:err });
    });
}
  