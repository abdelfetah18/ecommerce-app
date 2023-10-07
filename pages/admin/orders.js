import Navigation from "../../components/admin/Navigation";
import Orders from "../../components/admin/Orders";
import { getOrders } from "../../database/client";

export async function getServerSideProps({ req, query }){
    let orders = await getOrders();
    return { props:{ orders } };
}

export default function Orders_({ orders }){
    return(
        <div className={styles.container}>
            <Navigation page={"orders"}/>
            <Orders orders={orders} />
        </div>
    )
}

const styles = {
    container:"w-screen flex flex-row h-screen",
}