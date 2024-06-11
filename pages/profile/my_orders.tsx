import { motion, useAnimation } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import Orders from "../../components/Orders";
import axios from "axios";
import Products from "../../components/Products";
import useMyOrders from "../../hooks/useMyOrders";

export default function MyOrders() {
    const { isLoading, orders, selectedState, setSelectedState } = useMyOrders();
    const [order_dialog_open, setOrderDialogueOpen] = useState(false);
    const [selected_order, setSelectedOrder] = useState<Order>({ products: [{ name: "", images: [{ url: "" }], price: { value: 0, currency: 'USD' }, category: { name: "" } }], state: "Order Completed", payment_method: 'Paypal' });

    function toggleOrder() {
        setOrderDialogueOpen(true);
    }

    return (
        <div className="flex flex-col items-center w-full dark:bg-[#252936]">
            <Header />
            <div className="w-11/12 flex">
                <SideBar selectedTab="my-orders" />
                <Orders key={"MyOrders"} isLoading={isLoading} orders={orders} selected_order_state={selectedState} setSelectedOrderState={setSelectedState} setSelectedOrder={setSelectedOrder} toggleOrder={toggleOrder} />
            </div>
            <OrderDetails order={selected_order} useOrderDialogueOpen={[order_dialog_open, setOrderDialogueOpen]} />
        </div>
    )
}

interface OrderDetailsProps {
    order: Order;
    useOrderDialogueOpen: any;
};

function OrderDetails({ order, useOrderDialogueOpen }: OrderDetailsProps) {
    const [order_dialog_open, setOrderDialogueOpen] = useOrderDialogueOpen;
    const order_animation = useAnimation();

    const totalPrice = order.products.reduce((accumulator, product) => accumulator + product.price.value, 0);
    const currencyCode = order.products[0].price.currency;

    useEffect(() => {
        handleOrderAnimation();
    }, [order_dialog_open]);

    function handleOrderAnimation() {
        if (order_dialog_open) {
            order_animation.start({
                display: "flex",
                opacity: 1,
                transition: {
                    duration: 0.3
                }
            });
        } else {
            order_animation.start({
                opacity: 0,
                transition: {
                    duration: 0.3
                }
            }).then(() => {
                order_animation.set({
                    display: "none"
                });
            });
        }
    }

    function closeDialoge() {
        setOrderDialogueOpen(false);
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
                        <div className={style.total_price}>{totalPrice} {currencyCode}</div>
                    </div>
                    <div className={style.info_wrapper}>
                        <div className={style.label}>State: </div>
                        <div className={`${style.order_state} ${ORDER_STATE_TEXT_COLORS[order.state]}`}>
                            <div className={`mr-1 h-2 w-2 rounded-full ${ORDER_STATE_BG_COLORS[order.state]}`}></div>
                            {order.state}
                        </div>
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
    inner: "w-2/3 h-5/6 bg-gray-50 dark:bg-gray-900 rounded-md flex flex-col items-center",
    header: "w-full flex items-center justify-between border-b py-3 px-8",
    header_title: "text-xl text-black dark:text-gray-50",
    close_btn: "text-gray-700 dark:text-gray-50 text-xl cursor-pointer dark:hover:text-gray-300",
    order_info: "w-full flex flex-col my-4 px-8",
    info_wrapper: "flex items-center mt-4",
    label: "text-black text-sm w-24",
    total_price: "text-sm text-green-500 font-medium",
    order_state: "text-sm rounded-full font-medium flex items-center",
    products_section: "w-full flex-col mt-4 flex-grow overflow-auto px-8",
    products_section_title: "text-black text-lg dark:text-gray-100 py-2",
    products: "w-full overflow-auto flex flex-row flex-wrap"
};

const ORDER_STATE_BG_COLORS: OrderStateColors = {
    'Order Placed': 'bg-blue-400',
    'Payment Processed': 'bg-purple-400',
    'Order Confirmed': 'bg-cyan-400',
    'Shipped': 'bg-orange-400',
    'Delivered': 'bg-green-400',
    'Order Completed': 'bg-teal-400',
    'Order Cancelled': 'bg-red-400',
    'Refund Processed': 'bg-yellow-400',
};

const ORDER_STATE_TEXT_COLORS: OrderStateColors = {
    'Order Placed': 'text-blue-400',
    'Payment Processed': 'text-purple-400',
    'Order Confirmed': 'text-cyan-400',
    'Shipped': 'text-orange-400',
    'Delivered': 'text-green-400',
    'Order Completed': 'text-teal-400',
    'Order Cancelled': 'text-red-400',
    'Refund Processed': 'text-yellow-400',
};