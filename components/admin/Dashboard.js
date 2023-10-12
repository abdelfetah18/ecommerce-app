import { Line,getElementsAtEvent } from 'react-chartjs-2';
import { Chart,CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { AiFillDashboard } from "react-icons/ai";
import { IoMdMore } from "react-icons/io";
import { FaSearch,FaChevronUp } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const mounths = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

Chart.register([CategoryScale,LinearScale,PointElement,LineElement]);

export default function Dashboard({ user,today_orders,total_custumers,last_orders }){
    let [selected_user,setSelectedUser] = useState({ mounth_orders:[],user:{ username:"",total_revenue:0,orders_count:0 } });
    let [graph_labels,setGraphLabels] = useState([]);
    let [graph_data,setData] = useState([]);
    let [selected_graph_data,setSelectedGraphData] = useState({ label:new Date().toLocaleDateString("en-GB"),data:"0" });
    let myChart = useRef();
    
    useEffect(() => {
        if(selected_user.user != undefined){
            let list = [];
            let data = [];
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth();
            let yy = today.getFullYear();
            for(let i=0;i<31;i++){
                list.push((((dd+i)%(mm%2 == 0 && mm != 8 && mm!= 2 ? 30 : 31))+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })+"/"+(dd+i > 30 ? mm+1 : mm).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })+"/"+yy);
                data.push(0);
            }
            for(let i=0;i<selected_user.mounth_orders.length;i++){
                let total = 0;
                for(let j=0;j<selected_user.mounth_orders[i].products.length;j++){
                    total += parseFloat(selected_user.mounth_orders[i].products[j].price.value);
                }let index = parseInt(new Date(selected_user.mounth_orders[i]._createdAt).toLocaleDateString("en-GB").split("/")[0])-parseInt(new Date().toLocaleDateString("en-GB").split("/")[0]);
                data[index > 0 ? index : (30+index)] += parseFloat(total.toFixed(2));

            }
            setGraphLabels(list);
            setData(data);
        }
    },[selected_user]);

    useEffect(() => {
        if(graph_data.length > 0 && graph_labels.length > 0){
            setSelectedGraphData({ label:graph_labels[30],data:graph_data[30] });
        }
    },[graph_data,graph_labels])
        


    function calculateTodayRevnue(){
        let today_revenue = 0;
        for(let i=0;i<today_orders.length;i++){
            for(let j=0;j<today_orders[i].products.length;j++){
                today_revenue += parseFloat(today_orders[i].products[j].price.value);
            }
        }
        return today_revenue.toFixed(2);
    }

    function generateLabels(){
        let list = [];
        for(let i=1;i<30;i++){
            list.push(i+" june")
        }
        return list;
    }
    function generateData(){
        let list = [];
        for(let i=1;i<30;i++){
            list.push(Math.random()*10000)
        }
        return list;
    }

    function selectData(evt){
        let data = getElementsAtEvent(myChart.current,evt);
        if(data.length > 0){
            setSelectedGraphData({ label:graph_labels[data[0].index],data:graph_data[data[0].index] });
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.header_wrapper} >
                <div className={styles.title} >Dashboard</div>
                <AiFillDashboard className={styles.dashboard_icon} />
            </div>
            <div className={styles.info_wrapper}>
                <div className={styles.box_wrapper}>
                    <div className={styles.box_values_wrapper}>
                        <div className={styles.box_value}>${calculateTodayRevnue()}</div>
                        <div className={styles.box_title}>Daily revenue</div>
                    </div>
                    <div className={styles.box_values_percent_wrapper}>
                        <div className={styles.percent}>+{calculateTodayRevnue() == user.total_revenue ? 100 : (calculateTodayRevnue()/(user.total_revenue-calculateTodayRevnue())).toFixed(2)}%</div>
                    </div>
                </div>
                <div className={styles.box_wrapper}>
                    <div className={styles.box_values_wrapper}>
                        <div className={styles.box_value}>${parseFloat(user.total_revenue).toFixed(2)}</div>
                        <div className={styles.box_title}>Total revenue</div>
                    </div>
                    <div className={styles.box_values_percent_wrapper}>
                        <div className={styles.percent}>+{calculateTodayRevnue() == user.total_revenue ? 100 : ((calculateTodayRevnue()/(user.total_revenue-calculateTodayRevnue()))*100).toFixed(2)}%</div>
                    </div>
                </div>
                <div className={styles.box_wrapper}>
                    <div className={styles.box_values_wrapper}>
                        <div className={styles.box_value}>{total_custumers}</div>
                        <div className={styles.box_title}>Total custumers</div>
                    </div>
                </div>
            </div>
            <div className={styles.chart_container}>
                <div className={styles.chart_wrapper}>
                    <div className={styles.chart_header_wrapper}>
                        <div className={styles.chart_title}>Revenue</div>
                        <div className={styles.chart_description}>This week</div>
                    </div>
                    <Line
                        ref={myChart}
                        onClick={selectData}
                        data={{
                            labels: graph_labels.length > 0 ? graph_labels : generateLabels(),
                            datasets: [
                            {
                                label: 'Rainfall',
                                fill: false,
                                lineTension: 0,
                                backgroundColor: '#36589d',
                                borderColor: '#36589d',
                                borderWidth: 2,
                                pointBorderColor:"#36589d",
                                pointBackgroundColor:"white",
                                data:graph_data.length > 0 ? graph_data : generateData(),
                            }
                            ],

                        }}
                        className="cursor-pointer"
                    />
                </div>
                <div className={styles.chart_selected_container}>
                    <div className={styles.chart_selected_header_wrapper}>
                        <div className={styles.chart_selected_date}>{selected_graph_data.label}</div>
                        <IoMdMore className={styles.chart_selected_more_btn} />
                    </div>
                    <div className={styles.chart_selected_value_wrapper}>
                        <div className={styles.chart_selected_value}>${selected_graph_data.data}</div>
                    </div>
                    <div className={styles.chart_selected_user_container}>
                        <div className={styles.chart_selected_user_wrapper}>
                            <div className={styles.chart_selected_user}>
                                <div className={styles.chart_selected_user_image_wrapper}>
                                    <img className={styles.chart_selected_user_image} alt="profile_image" src={selected_user.user.profile_image ? selected_user.user.profile_image : "https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg"} />
                                </div>
                                <div className={styles.chart_selected_user_name}>{selected_user.user.username}</div>
                                <FaChevronUp className={styles.chart_selected_user_more}/>
                            </div>
                            <div className={styles.chart_selected_user_revenue_wrapper}>
                                <div className={styles.chart_selected_user_revenue}>${parseFloat(selected_user.user.total_revenue).toFixed(2)}</div>
                                <div className={styles.chart_selected_user_revenue_percent}>+{graph_data.length > 0 ? ((graph_data[30] == selected_user.user.total_revenue) ? 100 : (graph_data[30]/(selected_user.user.total_revenue-graph_data[30]))*100).toFixed(2) : 0}%</div>
                            </div>
                            <div className={styles.chart_selected_user_revenue_title}>Revenue</div>
                        </div>
                        <div className={styles.chart_selected_processed_applications_wrapper}>
                            <div className={styles.chart_selected_processed_applications_values_wrapper}>
                                <div className={styles.chart_selected_processed_applications_value}>{selected_user.user.orders_count}</div>
                                <div className={styles.chart_selected_processed_applications_value_percent}>-1%</div>
                            </div>
                            <div className={styles.chart_selected_processed_applications_title}>Processed applications</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.orders_container}>
                <div className={styles.orders_header_container}>
                    <div className={styles.orders_header_wrapper}>
                        <div className={styles.orders_header_title}>Last orders</div>
                        <FaSearch className={styles.orders_header_search}/>
                    </div>
                    <div>
                        <IoMdMore className={styles.orders_header_more}/>
                    </div>
                </div>
                <div className={styles.orders_wrapper}>
                    <div className={styles.orders_table_head}>
                        <div className={styles.orders_table_value}>Name</div>
                        <div className={styles.orders_table_value}>Order</div>
                        <div className={styles.orders_table_value}>Date</div>
                        <div className={styles.orders_table_value}>Sum</div>
                        <div className={styles.orders_table_value}>Payment method</div>
                    </div>
                    {
                        last_orders.map((order,i) => {
                            function getTotal(){
                                let total = 0;
                                for(let i=0;i<order.products.length;i++){
                                    total += parseFloat(order.products[i].price.value);
                                }
                                return total.toFixed(2);
                            }

                            async function selectUser(){
                                try {
                                    let response = await axios.post("/api/admin/get_user_revenue",{ user:order.user });
                                } catch (err){
                                    console.log("error:",err);
                                } finally {
                                    if(response.data.status == "success"){
                                        setSelectedUser(response.data.data);
                                    }
                                }
                            }

                            return(
                                <div key={i} onClick={selectUser} className={styles.orders_table_values}>
                                    <div className={styles.orders_user_wrapper}>
                                        <img className={styles.orders_user_image} alt="profile_image" src={order.user.profile_image ? order.user.profile_image : "https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg"} />
                                        <div className={styles.orders_user_name}>{order.user.username}</div>
                                    </div>
                                    <div className={styles.orders_table_value}>{order._id}</div>
                                    <div className={styles.orders_table_value}>{(new Date(order._createdAt)).toDateString()}</div>
                                    <div className={styles.orders_table_value}>${getTotal()}</div>
                                    <div className={styles.orders_table_value}>{order.payment_method}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
        </div>
    )
}

const styles = {
    container:"w-11/12 bg-[#252936] flex flex-col items-center overflow-auto",
    header_wrapper:"w-11/12 flex flex-row items-center justify-between mt-10",
    title:"font-medium text-[#cbcbcd]",
    dashboard_icon:"text-[#f5f5f5] text-xl",
    info_wrapper:"w-11/12 my-5 flex flex-row",
    box_wrapper:"w-1/3 flex flex-row bg-[#2c3040] rounded-lg px-2 mr-4",
    box_values_wrapper:"px-2 py-2 w-11/12",
    box_value:"text-[#f5f5f5] font-bold text-lg my-2",
    box_title:"text-[#87878a] font-medium text-sm my-2",
    box_values_percent_wrapper:"w-1/4 flex flex-col items-center justify-center",
    percent:"bg-[#314446] font-semibold text-sm text-[#208a3d] p-4 rounded-lg text-center w-11/12",
    chart_container:"w-11/12 flex flex-row shadow-xl",
    chart_wrapper:"w-2/3 bg-[#2c3040] p-5 rounded-l-lg flex flex-col",
    chart_header_wrapper:"flex flex-row pb-4",
    chart_title:"text-[#cbcbcd] text-base font-medium mx-1",
    chart_description:"text-[#bbbbbf] text-xs ml-2 self-end",
    chart_selected_container:"w-1/3 bg-[#262a36] p-5 rounded-r-lg flex flex-col items-center",
    chart_selected_header_wrapper:"w-11/12 flex flex-row items-center justify-between",
    chart_selected_date:"text-[#cbcbcd] text-base font-medium",
    chart_selected_more_btn:"text-[#cbcbcd] text-base font-medium",
    chart_selected_value_wrapper:"w-11/12 my-2",
    chart_selected_value:"text-[#cbcbcd] self-start text-2xl font-semibold",
    chart_selected_user_container:"w-11/12 flex flex-col items-center",
    chart_selected_user_wrapper:"w-full px-2 py-4 flex flex-col items-center rounded-tl-lg bg-[#2c3040]",
    chart_selected_user:"w-11/12 flex flex-row items-center",
    chart_selected_user_image_wrapper:"h-10 w-1/6 rounded-full",
    chart_selected_user_image:"h-10 w-10 rounded-full",
    chart_selected_user_name:"w-5/6 text-[#eeeeee] font-medium",
    chart_selected_user_more:"w-1/12 text-[#cbcbcd]",
    chart_selected_user_revenue_wrapper:"flex flex-row w-11/12 items-center justify-between py-2",
    chart_selected_user_revenue:"font-semibold text-lg text-[#eeeeee]",
    chart_selected_user_revenue_percent:"font-semibold text-base text-[#3be758]",
    chart_selected_user_revenue_title:"text-[#87878a] text-base font-medium w-11/12 py-2",
    chart_selected_processed_applications_wrapper:"w-full my-1 px-2 py-4 flex flex-col items-center rounded-bl-lg bg-[#2c3040]",
    chart_selected_processed_applications_values_wrapper:"w-11/12 flex lfex-row items-center justify-between my-2",
    chart_selected_processed_applications_value:"font-semibold text-base text-[#eeeeee]",
    chart_selected_processed_applications_value_percent:"font-semibold text-base text-[#e73b3b]",
    chart_selected_processed_applications_title:"w-11/12 text-sm text-[#87878a] my-2",
    orders_container:"w-11/12 flex flex-col items-center rounded-lg mt-5 bg-[#2c3040] my-4 py-4",
    orders_header_container:"w-11/12 flex flex-row items-center justify-between py-2",
    orders_header_wrapper:"flex flex-row items-center justify-between",
    orders_header_title:"text-[#bbbbbf] font-medium text-lg mx-2",
    orders_header_search:"text-[#bbbbbf]",
    orders_header_more:"text-[#bbbbbf] text-lg",
    orders_wrapper:"w-11/12 flex flex-col justify-between my-2",
    orders_table_head:"w-full flex flex-row items-center rounded-lg p-2 my-1",
    orders_table_values:"w-full flex flex-row items-center rounded-lg bg-[#252936] p-2 my-1 cursor-pointer",
    orders_table_value:"w-1/5 text-[#87878a] font-medium text-sm",
    orders_user_wrapper:"w-1/5 flex flex-row items-center",
    orders_user_image:"h-10 w-10 rounded-full",
    orders_user_name:"text-[#87878a] font-medium text-sm ml-2"
}