import { getUser, getUserOrders } from "../../../database/client";
import { decodeJwt } from "jose";
import { motion, useAnimation } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

import Header from "../../../components/Header";
import SideBar from "../../../components/SideBar";
import Orders from "../../../components/Orders";
import axios from "axios";
import Products from "../../../components/Products";

export async function getServerSideProps({ req }){
    const user_session = decodeJwt(req.cookies.access_token);
    const user = await getUser(user_session.user_id);
    const orders = await getUserOrders(user_session.user_id);
    
    return { props:{ user, orders } };
  }

export default function MyOrders({ user, orders, theme, setTheme }){
    const [order_state, setOrderState] = useState("Last orders");
    const [my_orders, setMyOrders] = useState(orders);
    const [order_dialog_open, setOrderDialogueOpen] = useState(false);
    const [selected_order,setSelectedOrder] = useState({ products:[{ name:"",images:[{ url: "" }],price:{ value:0 },category:{ name:"" } }],state:"" });

    useEffect(() => {
        const url = order_state == "Last orders" ? "/api/user/orders" : "/api/user/orders?state="+order_state;
        axios.get(url).then(response => {
            if(response.data.status == "success"){
                setMyOrders(response.data.data);
            }
        })
    },[order_state]);

    function toggleOrder(){
        setOrderDialogueOpen(true);
    }

    return(
        <div className="flex flex-col items-center w-full dark:bg-[#252936]">
            <Header user={user} theme={theme} setTheme={setTheme} />
            <div className="w-10/12 shadow-xl h-screen bg-gray-50 flex flex-row dark:bg-[#2c3040]">
                <SideBar key={"SideBar"} user={user} />
                <Orders key={"MyOrders"} orders={my_orders} selected_order_state={order_state} setSelectedOrderState={setOrderState} setSelectedOrder={setSelectedOrder} toggleOrder={toggleOrder} />
            </div>
            <OrderDetails order={selected_order} useOrderDialogueOpen={[order_dialog_open, setOrderDialogueOpen]} />
        </div>
    )
} 

function OrderDetails({ order, useOrderDialogueOpen }){
    const [order_dialog_open, setOrderDialogueOpen] = useOrderDialogueOpen;
    const order_animation = useAnimation();

    useEffect(() => {
        handleOrderAnimation();
    },[order_dialog_open]);

    function handleOrderAnimation(){
        if(order_dialog_open){
            order_animation.start({
                display:"flex",
                opacity:1,
                transition:{
                    delay:0.3
                }
            });
        }else{
            order_animation.start({
                opacity:0,
                transition:{
                    delay:0.3
                }
            }).then(() => {
                order_animation.set({
                    display:"none"
                });
            });
        }
    }

    function closeDialoge(){
        setOrderDialogueOpen(false);
    }

    function totalPrice(){
        return order.products.reduce((accumulator, product) => accumulator + parseFloat(product.price.value), 0);
    }

    return (
        <motion.div animate={order_animation} className={style.container}>
            <div className={style.inner}>
                <div className={style.header}>
                    <div className={style.header_title}>Order Details:</div>
                    <div onClick={closeDialoge} className={style.close_btn}><FaTimes /></div>
                </div>
                <div className={style.order_info}>
                    <div className={style.info_wrapper}>
                        <div className={style.label}>Total Price: </div>
                        <div className={style.total_price}>${totalPrice()}</div>
                    </div>
                    <div className={style.info_wrapper}>
                        <div className={style.label}>State: </div>
                        <div className={style.order_state}>{order.state}</div>
                    </div>
                </div>
                <div className={style.products_section}>
                    <div className={style.products_section_title}>Products:</div>
                    <Products products={order.products} isPreview={true} />
                </div>
            </div>
        </motion.div>
    );
}

const style = {
    container: "absolute top-0 left-0 w-full h-screen bg-black/60 flex items-center justify-center hidden",
    inner: "w-2/3 h-5/6 bg-gray-50 dark:bg-gray-900 rounded-md flex flex-col items-center py-2 px-8",
    header: "w-full flex items-center justify-between",
    header_title: "text-lg uppercase font-semibold text-gray-700 dark:text-gray-50",
    close_btn: "text-gray-700 dark:text-gray-50 text-xl cursor-pointer dark:hover:text-gray-300",
    order_info: "w-full flex flex-col my-4",
    info_wrapper: "flex items-center mt-4",
    label: "text-gray-800 dark:text-gray-50 text-sm mr-4",
    total_price: "text-sm text-green-600 font-medium",
    order_state: "text-sm font-semibold text-red-500 uppercase rounded-full",
    products_section: "w-full flex-col mt-4 flex-grow overflow-auto",
    products_section_title: "text-gray-800 dark:text-gray-100 font-bold py-2",
    products: "w-full overflow-auto flex flex-row flex-wrap"
};