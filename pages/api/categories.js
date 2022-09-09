import { getData } from "../../database/client";

export default function handler(req, res) {
    getData('*[ _type=="categories"]{_id,name,icon }',{}).then((result) => {
        res.status(200).json({ status:"success", data: result });
    }).catch((err) => {
        res.status(200).json({ status:"error", message:"Something went wrong!",error:err });
    });
}
  