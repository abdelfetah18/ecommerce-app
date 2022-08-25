import { updateData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method === "POST"){
        var data = req.body;
        try {
            var result = await updateData(data.order_id,{ state:data.state });
        } catch(err) {
            console.log(err);
            res.status(200).json({
                status:"error",
                message:"something went wrong!"
            })
        } finally {
            res.status(200).json({
                status:"success",
                message:"state updated!"
            });
        }
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}
