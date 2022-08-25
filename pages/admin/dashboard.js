import Header from "../../components/admin/Header";
import Navigation from "../../components/admin/Navigation";
import Dashboard from "../../components/admin/Dashboard";
import { getData } from "../../database/client";
import { decodeJwt } from "jose";

export async function getServerSideProps({ req }){
    var user = decodeJwt(req.cookies.access_token);
    var today = new Date();
    var dd = (today.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
    var mm = (today.getMonth()+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    var yy = today.getFullYear();

    var today_orders = await getData('*[_type=="orders" && state != "Not Processing" && _createdAt >= $today]{_id,state,"products":products[]->{name,"images":images[].asset->url,price->,category->},payment_method,_createdAt}',{ today:yy+"-"+mm+"-"+dd });
    var user_info = await getData('*[_type=="users" && _id==$user_id]{ _id,username,email,role,email_verify,total_revenue,"profile_image":profile_image.asset->url, }',{ user_id:user.user_id });
    var total_custumers = await getData('{"total_custumers":count(*[_type=="users" && role!="admin"]),}',{});
    var last_orders = await getData('*[_type=="orders"]{_id,_createdAt,"products":products[]->{name,"images":images[].asset->url,price->,category->},payment_method,state,"user":user->{_id,username,email,"profile_image":profile_image.asset->url}}[0..4] | order(_createdAt desc)');

    return {
        props:{
            today_orders,user:user_info[0],total_custumers:total_custumers.total_custumers,last_orders
        }
    }
}

export default function Dashboard_({ today_orders,user,total_custumers,last_orders }){
    return(
        <div className={styles.container}>
            <Navigation page={"dashboard"}/>
            <Dashboard today_orders={today_orders} user={user} total_custumers={total_custumers} last_orders={last_orders} />
        </div>
    )
}

const styles = {
    container:"w-screen flex flex-row h-screen",
}