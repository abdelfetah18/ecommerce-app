import Link from "next/link";

export default function Orders({ orders, selected_state, setSelectedOrder, toggleOrder }){
    return (
        <div className="w-3/4 h-screen flex flex-col items-center bg-white dark:bg-[#252936]">
            <div className="w-11/12 flex flex-row items-center py-4">
                <div className="text-xl font-bold dark:text-[#cbcbcd]">My orders:</div>
            </div>
            <div className="w-11/12 flex flex-col items-center mb-5">
                <div className="w-full flex flex-row items-center">
                    {
                        ["Last orders","Processing","Shipped","Delivered"].map((value,index) => {
                            return(
                                <Link key={index} href={(value === "Last orders" ? "/my_profile/my_orders" : "/my_profile/my_orders/"+value)}><div className={"text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md mr-4 cursor-pointer dark:bg-gray-900 "+(selected_state === value ? "text-blue-500 dark:text-blue-600" : "text-gray-600 dark:text-[#cbcbcb]")}>{value}</div></Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className="w-11/12 flex flex-row flex-wrap">
                {
                    orders.map((order,index) => {
                        
                        function getTotal(){
                            var total = 0;
                            for(var i=0;i<order.products.length;i++){
                                total += parseFloat(order.products[i].price.value);
                            }
                            
                            return parseFloat(total).toFixed(2);
                        }

                        function selectOrder(){
                            console.log(order);
                            setSelectedOrder({ ...order,total:getTotal() });
                            toggleOrder();
                        }

                        return(
                            <div key={index} className="w-1/4 flex flex-col flex-wrap items-center bg-gray-100 dark:bg-[#2c3040] rounded-lg py-1 mx-1 my-1 hover:shadow-xl">
                                <div className="flex flex-row items-center justify-between w-11/12">
                                    <div className="w-11/12 text-lg font-semibold my-2 dark:text-[#cbcbcb]">${getTotal()}</div>
                                    <div className="text-sm font-medium text-green-500 px-3 py-1  rounded-full">{order.state}</div>
                                </div>
                                
                                <div className="flex flex-row items-center w-11/12 my-2">
                                    <div className="text-sm font-normal mx-2 dark:text-[#cbcbcb]">On </div>
                                    <div className="text-xs font-semibold text-gray-800 dark:text-[#cbcbcb99]">{(new Date(order._createdAt)).toLocaleString()}</div>
                                </div>
                                <div onClick={selectOrder} className="text-sm font-medium bg-blue-500 text-white rounded-full px-4 py-1 my-2 cursor-pointer">view order details</div>
                            </div>
                        )
                    })
                }
                
            </div>
        </div>
    )    
}