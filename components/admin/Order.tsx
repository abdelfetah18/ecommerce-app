import { useState } from "react";
import { PROFILE_IMAGE_PLACEHOLDER } from "../../utilities/consts";
import OrderActionsMenu from "./OrderActionsMenu";
import OrderStateDropDown from "./OrderStateDropDown";

interface OrderProps {
    order: Order;
    viewOrder: () => void;
};

export default function Order({ order, viewOrder }: OrderProps) {
    let [_order, setOrder] = useState<Order>(order);
    let [canEdit, setCanEdit] = useState(false);

    return (
        <div className={styles.orders_table_values}>
            <div className={styles.orders_user_wrapper}>
                <img className={styles.orders_user_image} alt="profile_image" src={order.user?.profile_image?.url || PROFILE_IMAGE_PLACEHOLDER} />
                <div className={styles.orders_user_name}>{_order.user.username}</div>
            </div>
            <div className={`${styles.orders_table_value} text-ellipsis whitespace-nowrap overflow-hidden pr-4`} title={_order._id}>{_order._id}</div>
            <div className={styles.orders_table_value}>{(new Date(_order._createdAt)).toDateString()}</div>
            <div className={`${styles.orders_table_value} ${ORDER_STATE_TEXT_COLORS[_order.state]}`}>
                {
                    canEdit ? (
                        <OrderStateDropDown useOrder_={[_order, setOrder]} useCanEdit={[canEdit, setCanEdit]} />
                    ) : (
                        <>
                            <div className={`mr-1 h-2 w-2 rounded-full ${ORDER_STATE_BG_COLORS[_order.state]}`}></div>
                            {_order.state}
                        </>
                    )
                }
            </div>
            <div className={styles.orders_table_value + " flex flex-row justify-between"}>{_order.payment_method}
                <OrderActionsMenu updateStateHandler={() => { setCanEdit(state => !state); }} viewOrderHandler={viewOrder} />
            </div>
        </div>
    )
}

const styles = {
    orders_table_values: "w-full flex flex-row items-center rounded-lg bg-gray-100 p-2 my-1",
    orders_table_value: "w-1/5 text-black font-medium text-sm relative text-black flex items-center",
    orders_user_wrapper: "w-1/5 flex flex-row items-center",
    orders_user_image: "h-10 w-10 rounded-full",
    orders_user_name: "text-black font-medium text-sm ml-2 capitalize",
    orders_header_search_input: "ml-2 w-0 text-[#bbbbbf] py-1 bg-transparent border-[#bbbbbf] font-semibold border-b-2"
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