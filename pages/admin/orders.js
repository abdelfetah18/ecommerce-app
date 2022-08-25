import Header from "../../components/admin/Header";
import Navigation from "../../components/admin/Navigation";
import Orders from "../../components/admin/Orders";
import { getData } from "../../database/client";

export async function getServerSideProps({ req,query }){
    
    var orders = await getData('*[_type=="orders"]{_id,_createdAt,"products":products[]->,payment_method,state,"user":user->{_id,username,email}}');

    return {
        props:{
            orders
        }
    }
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