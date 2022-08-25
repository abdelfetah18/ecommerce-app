import { getData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var data = req.body;
        try {
            var today = new Date();
            var dd = (today.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
            var mm = (today.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
            var yy = today.getFullYear();
            var mounth_orders = await getData('*[_type=="orders" && user->username==$username && _createdAt >= $mounth_before]{_id,_createdAt,"products":products[]->{name,"images":images[].asset->url,price->,category->},payment_method,state,"user":user->{_id,username,email}}',{ username:data.user.username,mounth_before:yy+"-"+mm+"-"+dd })
            var user = await getData('*[_type=="users" && username==$username]{ _id,username,email,role,email_verify,total_revenue,"profile_image":profile_image.asset->url,"orders_count":count(*[_type=="orders" && user->username==$username]) }[0]',{ username:data.user.username });
        } catch (err){
            console.log(err)
            res.status(200).json({ status:"error",message: 'something went wrong!' });
        } finally {
            res.status(200).json({ status:"success",message: 'data fetched successfully!',data:{ mounth_orders,user } });
        }
    }else{
        res.status(405).json({ status:"error", message:"method not found!" });
    }
}
  