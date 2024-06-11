import { NextApiRequest, NextApiResponse } from "next";
import { updateData } from "../../../database/client";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        let data = req.body;
        try {
            await updateData(data.order_id,{ state:data.state });
            res.status(200).json({ status:"success", message:"state updated!" });
        } catch(err) {
            console.log(err);
            res.status(200).json({ status:"error", message:"something went wrong!" });
        }
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}
