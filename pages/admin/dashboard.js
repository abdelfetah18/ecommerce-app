import Navigation from "../../components/admin/Navigation";
import Dashboard from "../../components/admin/Dashboard";
import { getLastOrders, getTodayOrders, getTotalCustomers, getUser } from "../../database/client";
import { decodeJwt } from "jose";

export async function getServerSideProps({ req }){
    let user_session = decodeJwt(req.cookies.access_token);

    let today_orders = await getTodayOrders();
    let user = await getUser(user_session.user_id);
    let total_custumers = await getTotalCustomers();
    let last_orders = await getLastOrders();

    return { props:{ today_orders, user, total_custumers: total_custumers.total_custumers, last_orders } };
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