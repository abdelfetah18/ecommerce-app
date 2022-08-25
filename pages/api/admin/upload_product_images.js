import { Formidable } from "formidable";
import { uploadImage } from "../../../database/client";

export const config = {
    api: {
      bodyParser: false
    }
};

export default function handle( req, res){
    if(req.method == "POST"){
        var form = new Formidable();
        form.parse(req,async ( err,fields, files) => {
            if(err){
                res.status(200).json({
                    status:"error",
                    message:"something went wrong!"
                });
            }else{
                var images = [];
                var f = Object.getOwnPropertyNames(files);
                for(var i=0;i<f.length;i++){
                    var asset = await uploadImage(files[f[i]].filepath);
                    images.push(asset.image);
                }
                res.status(200).json({
                    status:"success",
                    message:"uploaded successfuly!",
                    images
                });
            }
        });
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}