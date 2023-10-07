import { getLastMounthUserOrders, getUserRevenue } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var { user: { username } } = req.body;
        try {
            let mounth_orders = await getLastMounthUserOrders(username);
            let user = await getUserRevenue(username);
            res.status(200).json({ status:"success",message: 'data fetched successfully!',data:{ mounth_orders,user } });
        } catch (err){
            console.log(err)
            res.status(200).json({ status:"error",message: 'something went wrong!' });
        } finally {
        }
    }else{
        res.status(405).json({ status:"error", message:"method not found!" });
    }
}
  