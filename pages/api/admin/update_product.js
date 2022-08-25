import { addData, updateData } from "../../../database/client";

export default function handle( req, res){


    if(req.method == "POST"){
        var data = req.body;
        console.log(data);
        updateData(data.price._id,{ _type:"prices",...data.price }).then((r) => {
            var doc = { _type:"products",name:data.name,price:{ _ref:r._id },category:{ _ref:data.category._id },images:[] };
            for(var i=0;i<data.images.length;i++){
                doc.images.push({ _type: 'image', asset: { _type: "reference", _ref: data.images[i]._id }});
            }
            updateData(data._id,doc).then((result) => {
                console.log("result:",result);
                res.status(200).json({
                    status:"success",
                    message:"updated successfuly!"
                });
            }).catch((err) => {
                console.log("err:",err);
                res.status(200).json({
                    status:"error",
                    message:"something went wrong!",
                    error:err
                });
            });
        }).catch((err) => {
            
        })
        
        
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}