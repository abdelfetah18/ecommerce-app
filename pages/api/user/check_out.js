import PayPal from "@paypal/checkout-server-sdk";
import { decodeJwt } from "jose";
import { addData, getData, newOrder } from "../../../database/client";

let environment = new PayPal.core.SandboxEnvironment("AXa9T1IwDDwKYKXiOWnk2JkftTWo025ISE4SmhSpug3cNcuShrvI16vrNqdh6gnP4AGK72YuLwvOGE7-", "EEtIzmpjrQpuxZNCZ0wp4XPlTNsp4PVudwEmQoIZDpddp-z1zBtm_paDtysKe3BpGl3G3wBNITOisgeu");
let client = new PayPal.core.PayPalHttpClient(environment);

export default async function handler(req, res) {
    if(req.method === "POST"){
        let user = decodeJwt(req.cookies.access_token || req.headers.authorization);
        let data = req.body;
        let items = [];
        for(let i=0;i<data.shopping_cart.length;i++){
            items.push(data.shopping_cart[i]._id);
        }

        //if success execute payment else return error
        getData('*[_type=="products" && _id in $items]{ _id,"price":price->value }',{ items }).then((result) => {
            //check for the total
            let total = 0;
            for(let i=0;i<result.length;i++){
                total += parseFloat(result[i].price);
            }
            let request = new PayPal.orders.OrdersGetRequest(data.orderId);
            client.execute(request).then((response) => {
                let expected = parseFloat(response.result.purchase_units[0].amount.value);
                if(expected.toFixed(2) == total.toFixed(2)){
                    let _refs = [];
                    for(let i=0;i<data.shopping_cart.length;i++){
                        _refs.push({ _ref:data.shopping_cart[i]._id });
                    }
                    addData({ _type:"orders",products:_refs,state:"Processing",user:{ _ref:user.user_id },payment_method:"PayPal" }).then((r) => {
                        newOrder(user.user_id,total).then((rr) => {
                            res.status(200).json({ status:"success",message:"Order in processing state, you can check the order state from your profile." }); 
                        });
                    }).catch((err) => {
                        res.status(200).json({
                            status:"error",
                            message:"something went wrong!"
                        });
                    });
                }else{
                    res.status(200).json({
                        status:"error",
                        message:"are playing with the values!"
                    });
                }
            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => { 
            console.log(err);
        });
    }else{
        res.status(405).send("Method Not Allowed!");
    }
}
