import moment from "moment";
import { ORDER_STATES } from "../utilities/consts";
import Loading from "./Loading";

export default function Orders({ isLoading, orders, selected_order_state, setSelectedOrderState, setSelectedOrder, toggleOrder }) {
    return (
        <div className="w-5/6 h-screen flex flex-col items-center">
            <div className="w-11/12 flex flex-row items-center mt-8 py-2">
                <div className="text-xl text-black capitalize">My Orders:</div>
            </div>
            <Labels selected_order_state={selected_order_state} setSelectedOrderState={setSelectedOrderState} />
            {
                isLoading ? (
                    <div className="w-full flex flex-col items-center">
                        <Loading />
                    </div>
                ) : (
                    <MyOrders orders={orders} setSelectedOrder={setSelectedOrder} toggleOrder={toggleOrder} />
                )
            }
        </div>
    )
}

const Labels = ({ selected_order_state, setSelectedOrderState }) => {
    return (
        <div className="w-11/12 flex flex-col items-center mb-5">
            <div className="w-full flex flex-row items-center flex-wrap">
                {
                    ["all", ...ORDER_STATES].map((value, index) => {
                        function selectOrderState() {
                            setSelectedOrderState(value);
                        }

                        return (
                            <div key={index} onClick={selectOrderState}>
                                <div className={`text-sm font-medium px-8 py-2 rounded-full capitalize m-1 duration-300 active:scale-110 cursor-pointer ${selected_order_state === value ? 'text-white bg-primary-color' : 'text-black bg-gray-100'}`}>{value}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}


const MyOrders = ({ orders, setSelectedOrder, toggleOrder }) => {
    return (
        <div className="w-11/12 flex flex-row flex-wrap">
            {
                orders.map((order: Order, index: number) => {
                    const total = order.products.reduce((sum, b) => sum + b.price.value, 0).toFixed(2);
                    const currency = order.products[0].price.currency;

                    function selectOrder() {
                        console.log(order);
                        setSelectedOrder({ ...order, total });
                        toggleOrder();
                    }

                    return (
                        <div key={index} onClick={selectOrder} className="w-1/4 flex flex-col flex-wrap items-center bg-gray-100 dark:bg-[#2c3040] rounded-lg p-4 mx-1 my-1 hover:shadow-xl duration-300 active:scale-105 cursor-pointer">
                            <div className="w-full flex items-center justify-between">
                                <div className="text-black">{order.products.length} {order.products.length > 1 ? 'Items' : 'Item'}</div>
                                <div className="text-xs text-gray-400">{moment(order._createdAt).fromNow()}</div>
                            </div>
                            <div className="w-full flex items-center justify-between mt-4">
                                <div className="text-green-500">{total} {currency}</div>
                                <div className={`text-xs text-white capitalize px-4 py-1 rounded-full ${ORDER_STATE_BG_COLORS[order.state]}`}>{order.state}</div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

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