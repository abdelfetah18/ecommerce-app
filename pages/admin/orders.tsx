import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import useOrders from "../../hooks/useOrders";
import Order from "../../components/admin/Order";
import Model from "../../components/Model";
import useModel from "../../hooks/useModel";
import { FaTimes } from "react-icons/fa";
import Product from "../../components/Product";
import { PLACEHOLDER_IMAGE } from "../../utilities/consts";
import Slider from "../../components/Slider";

export default function Orders() {
    const [selectedProduct, setSelectedProduct] = useState<Product>({ name: '', category: { name: '' }, images: [], price: { currency: 'USD', value: 0 } });
    const [selectedOrder, setSelectedOrder] = useState<Order>({ state: 'Delivered', payment_method: '', products: [] });
    const { orders, getOrders } = useOrders();
    const useModelValue = useModel();
    const useProductModelValue = useModel();

    useEffect(() => {
        getOrders();
    }, []);

    const totalOrderPrice = selectedOrder.products.reduce((sum, product) => product.price.value + sum, 0);
    const currencyCode = selectedOrder.products.length > 0 ? selectedOrder.products[0].price.currency : 'USD';

    return (
        <AdminLayout page="orders">
            <div className={styles.container}>
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Orders</div>
                </div>
                <div className={styles.orders_container}>
                    <div className={styles.orders_header_container}>
                        <div className={styles.orders_header_wrapper}>
                            <div className={styles.orders_header_title}>Last orders</div>
                        </div>
                    </div>
                    <div className={styles.orders_wrapper}>
                        <div className={styles.orders_table_head}>
                            <div className={styles.orders_table_value}>Name</div>
                            <div className={styles.orders_table_value}>Order</div>
                            <div className={styles.orders_table_value}>Date</div>
                            <div className={styles.orders_table_value}>State</div>
                            <div className={styles.orders_table_value}>Payment method</div>
                        </div>
                        {
                            orders.map((order, i) => {
                                const viewOrderHandler = (): void => {
                                    setSelectedOrder(order);
                                    useModelValue.open();
                                }

                                return (<Order key={i} order={order} viewOrder={viewOrderHandler} />)
                            })
                        }
                    </div>
                </div>

                <Model useModel={useModelValue}>
                    <div className="w-2/3 min-w-[600px] h-11/12 flex flex-col items-center py-4 bg-white border-2 rounded-lg">
                        <div className="w-11/12 h-full flex flex-col">
                            <div className="w-full flex items-center justify-end py-2">
                                <div onClick={() => useModelValue.close()} className="text-xl text-black cursor-pointer active:scale-125 duration-300"><FaTimes /></div>
                            </div>

                            <div className="w-full flex items-center">
                                <div className="w-40 text-black">Total Price:</div>
                                <div className="text-green-500 font-semibold capitalize">{totalOrderPrice.toFixed(2)} {currencyCode}</div>
                            </div>
                            <div className="w-full flex items-center mt-2">
                                <div className="w-40 text-black">Payment Method:</div>
                                <div className="text-black font-semibold capitalize">{selectedOrder.payment_method}</div>
                            </div>
                            <div className="w-full flex items-center mt-2">
                                <div className="w-40 text-black">Products:</div>
                                <div className="text-black">{selectedOrder.products.length} {selectedOrder.products.length > 1 ? "Products" : "Product"}</div>
                            </div>

                            <div className="w-full max-h-[400px] flex flex-wrap overflow-auto mt-8">
                                {
                                    selectedOrder.products.map((p, i) => {

                                        const selectProductHandler = (event: React.MouseEvent<HTMLDivElement>) => {
                                            setSelectedProduct(p);
                                            useProductModelValue.open();
                                        }

                                        return (
                                            <div key={i} className={styles.product_container}>
                                                <div onClick={selectProductHandler} className={styles.product_wrapper}>
                                                    <div className={styles.product_image_wrapper}>
                                                        <img className={styles.product_image} alt="product_image" src={p.images.length > 0 ? p.images[0].url : PLACEHOLDER_IMAGE} />
                                                    </div>
                                                    <div className={styles.product_name}>{p.name}</div>
                                                    <div className={styles.product_category}>{p.category.name}</div>
                                                    <div className={styles.product_price}>${p.price.value}</div>
                                                    <div className={styles.product_sells}>{p.sells} Sells</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Model>

                <Model useModel={useProductModelValue}>
                    <div className="w-1/2 min-w-[600px] flex flex-col items-center py-4 bg-white border-2 rounded-lg">
                        <div className="w-11/12 flex flex-col">
                            <div className="w-full flex items-center justify-end py-2">
                                <div onClick={() => useProductModelValue.close()} className="text-xl text-black cursor-pointer active:scale-125 duration-300"><FaTimes /></div>
                            </div>
                            <Slider images={selectedProduct.images} />
                            <div className="w-full text-black font-semibold capitalize mt-2">{selectedProduct.name}</div>
                            <div className="text-sm text-gray-300">{selectedProduct.category.name}</div>
                            <div className="w-full text-green-500 font-semibold">{selectedProduct.price.value} {selectedProduct.price.currency}</div>
                            <div className="w-full text-gray-500 text-xs">{selectedProduct.sells} Sells</div>
                        </div>
                    </div>
                </Model>
            </div>
        </AdminLayout>
    )
}


const styles = {
    container: "w-5/6 bg-white flex flex-col items-center overflow-auto",
    header_wrapper: "w-11/12 flex flex-row items-center justify-between mt-10",
    title: "font-medium text-lg text-black",
    orders_container: "w-11/12 flex flex-col items-center rounded-lg mt-5 border shadow-lg my-4 py-4 flex-grow",
    orders_header_container: "w-11/12 flex flex-row items-center justify-between py-2",
    orders_header_wrapper: "flex flex-row items-center w-11/12",
    orders_header_title: "text-black font-medium text-lg mx-2",
    orders_wrapper: "w-11/12 flex flex-col justify-between my-2 flex-grow",
    orders_table_head: "w-full flex flex-row items-center rounded-lg p-2 my-1 border-b",
    orders_table_value: "w-1/5 text-black font-medium text-sm text-black",
    product_container: "w-1/5 flex flex-col items-center my-4 pr-2",
    product_wrapper: "w-full h-full flex flex-col items-center cursor-pointer active:scale-105 duration-300",
    product_image_wrapper: "w-full aspect-square rounded-lg flex flex-col items-center bg-white",
    product_image: " h-full rounded-lg object-contain aspect-square",
    product_name: "w-11/12 text-base font-semibold text-black mt-2",
    product_category: "w-11/12 text-sm text-gray-300 mt-2",
    product_price: "w-11/12 text-green-500 mt-2",
    product_sells: "w-11/12 text-yellow-500 mb-4",
    categories_wrapper: "opacity-0 hidden absolute rounded-lg w-60 shadow-xl flex-col items-center bg-gray-100",
    category: "w-full py-2 cursor-pointer rounded-lg font-semibold text-black hover:text-primary-color hover:bg-gray-200",
};