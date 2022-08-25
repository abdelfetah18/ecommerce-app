import { addData } from "../../../database/client";

export default function handle( req, res){
    if(req.method == "POST"){
        var data = req.body;
        addData({ _type:"categories",name:data.name }).then(() => {
            res.status(200).json({
                status:"success",
                message:"new category added successfuly!"
            });
        }).catch((err) => {
            res.status(200).json({
                status:"error",
                message:"something went wrong!"
            });
        });
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}