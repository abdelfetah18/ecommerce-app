export default function Orders({ orders, selected_order_state, setSelectedOrderState, setSelectedOrder, toggleOrder }){
    return (
        <div className="w-3/4 h-screen flex flex-col items-center bg-white dark:bg-[#252936]">
            <div className="w-11/12 flex flex-row items-center py-4">
                <div className="text-xl font-bold dark:text-[#cbcbcd]">My orders:</div>
            </div>
           <Labels selected_order_state={selected_order_state} setSelectedOrderState={setSelectedOrderState} />
           <MyOrders orders={orders} setSelectedOrder={setSelectedOrder} toggleOrder={toggleOrder} />
        </div>
    )    
}

const Labels = ({ selected_order_state, setSelectedOrderState }) => {
    return (
        <div className="w-11/12 flex flex-col items-center mb-5">
            <div className="w-full flex flex-row items-center">
                {
                    ["Last orders","Processing","Shipped","Delivered"].map((value,index) => {
                        function selectOrderState(){
                            setSelectedOrderState(value);
                        }

                        return(
                            <div key={index} onClick={selectOrderState}><div className={"text-sm font-medium px-4 py-1 rounded-full bg-gray-100 shadow-md mr-4 cursor-pointer dark:bg-gray-900 "+(selected_order_state === value ? "text-blue-500 dark:text-blue-600" : "text-gray-600 dark:text-[#cbcbcb]")}>{value}</div></div>
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
                        <div key={index} className="w-1/4 flex flex-col flex-wrap items-center bg-gray-100 dark:bg-[#2c3040] rounded-lg py-4 mx-1 my-1 hover:shadow-xl">
                            <div className="flex flex-row items-center justify-between w-5/6">
                                <div className="w-11/12 text-lg font-semibold dark:text-[#cbcbcb]">${getTotal()}</div>
                                <div className="text-sm font-medium text-green-500 px-3  rounded-full">{order.state}</div>
                            </div>
                            
                            <div className="flex flex-row items-center w-5/6 mt-4 mb-2">
                                <div className="text-sm font-medium mx-2 dark:text-[#cbcbcb]">on </div>
                                <div className="text-xs font-semibold text-gray-800 dark:text-[#cbcbcb99]">{(new Date(order._createdAt)).toLocaleString()}</div>
                            </div>
                            <div onClick={selectOrder} className="text-xs font-medium bg-blue-500 hover:bg-blue-600 text-blue-50 rounded-full px-8 py-1 cursor-pointer uppercase">View Details</div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}