import moment from "moment";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import useOrders from "../../hooks/useOrders";
import ToastContext from "../../contexts/ToastContext";
import { PROFILE_IMAGE_PLACEHOLDER } from "../../utilities/consts";

interface LatestOrdersProps {
    useSelectedUser: [ChartUser, Dispatch<SetStateAction<ChartUser>>];
    useSelectedChartData: [ChartData, Dispatch<SetStateAction<ChartData>>];
};

export default function LatestOrders({ useSelectedUser, useSelectedChartData }: LatestOrdersProps) {
    const toastManager = useContext(ToastContext);
    const { orders: lastOrders, getLastOrders, getUserRevenue } = useOrders();
    const [, setSelectedUser] = useSelectedUser;
    const [, setSelectedChartData] = useSelectedChartData;

    useEffect(() => {
        getLastOrders();
    }, []);

    return (
        <div className={styles.orders_container}>
            <div className={styles.orders_header_container}>
                <div className={styles.orders_header_wrapper}>
                    <div className={styles.orders_header_title}>Latest Orders</div>
                </div>
            </div>
            <div className={styles.orders_wrapper}>
                <div className={styles.orders_table_head}>
                    <div className={styles.orders_table_value}>Name</div>
                    <div className={styles.orders_table_value}>Order</div>
                    <div className={styles.orders_table_value}>Date</div>
                    <div className={styles.orders_table_value}>Total</div>
                    <div className={styles.orders_table_value}>Payment method</div>
                </div>
                {
                    lastOrders.map((order, i) => {
                        const totalPrice = order.products.reduce((a, b) => a + b.price.value, 0);
                        const currencyCode = order.products[0].price.currency;

                        async function selectUser() {
                            const response = await getUserRevenue(order.user._id);
                            if (response.isError) {
                                toastManager.alertError("Error", response.message);
                            } else {
                                setSelectedUser(response.value);

                                const orders: Order[] = response.value.mounthOrders.filter(order => moment(order._createdAt).format('DD MMMM') == moment().format('DD MMMM'));
                                const value = orders.reduce((a, b) => a + b.products.reduce((c, d) => c + d.price.value, 0), 0);
                                setSelectedChartData({ date: moment().format('DD MMMM'), value: value });
                            }


                        }

                        return (
                            <div key={i} onClick={selectUser} className={styles.orders_table_values}>
                                <div className={styles.orders_user_wrapper}>
                                    <img className={styles.orders_user_image} alt="profile_image" src={order.user?.profile_image.url || PROFILE_IMAGE_PLACEHOLDER} />
                                    <div className={styles.orders_user_name}>{order.user.username}</div>
                                </div>
                                <div className={`${styles.orders_table_value} text-ellipsis whitespace-nowrap overflow-hidden pr-4`} title={order._id}>{order._id}</div>
                                <div className={styles.orders_table_value}>{moment().format('DD MMMM YYYY hh:mm A')}</div>
                                <div className={`${styles.orders_table_value} text-green-500`}>{totalPrice.toFixed(2)} {currencyCode}</div>
                                <div className={styles.orders_table_value}>{order.payment_method}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const styles = {
    orders_container: "w-11/12 flex flex-col items-center rounded-lg mt-5 border shadow-lg my-4 py-4",
    orders_header_container: "w-11/12 flex flex-row items-center justify-between py-2",
    orders_header_wrapper: "flex flex-row items-center justify-between",
    orders_header_title: "text-black font-medium text-lg mx-2",
    orders_header_search: "text-gray-400 cursor-pointer active:scale-110 select-none duration-300",
    orders_header_more: "text-black text-lg",
    orders_wrapper: "w-11/12 flex flex-col justify-between my-2",
    orders_table_head: "w-full flex flex-row items-center rounded-lg p-2 my-1 border-b",
    orders_table_values: "w-full flex flex-row items-center rounded-lg bg-gray-50 p-2 my-1 cursor-pointer",
    orders_table_value: "w-1/5 text-black font-medium text-sm",
    orders_user_wrapper: "w-1/5 flex flex-row items-center",
    orders_user_image: "h-10 w-10 rounded-full object-cover",
    orders_user_name: "text-black capitalize font-medium text-sm ml-2"
};