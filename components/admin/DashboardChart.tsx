import { useEffect, useRef, useState } from "react";
import { Line, getElementsAtEvent } from "react-chartjs-2";
import { FaChevronUp } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { PROFILE_IMAGE_PLACEHOLDER } from "../../utilities/consts";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import moment from "moment";
import LatestOrders from "./LatestOrders";

Chart.register([CategoryScale, LinearScale, PointElement, LineElement]);


export default function DashboardChart() {
    const myChart = useRef<Chart<"line", any[], any>>(null);

    const [selectedUser, setSelectedUser] = useState<ChartUser>({ mounthOrders: [], ordersCount: 0, totalRevenue: 0, user: { username: '' } });
    const [selectedChartData, setSelectedChartData] = useState<ChartData>({ date: moment().format('DD MMMM'), value: 0 });
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        generateChartData();
    }, [selectedUser]);

    const chartLabels: string[] = (() => {
        let date = moment().subtract('month', 1);
        const dateList: string[] = [];

        for (let index = 0; index <= 31; index++) {
            dateList.push(date.format('DD MMMM'));
            date = date.add('day', 1);
        }

        return dateList;
    })();

    const generateChartData = (): void => {
        let date = moment().subtract('month', 1);
        const dataList: number[] = [];

        for (let index = 0; index <= 31; index++) {
            const orders = selectedUser.mounthOrders.filter(order => moment(order._createdAt).format('DD MMMM') == date.format('DD MMMM'));
            dataList.push(orders.reduce((a, b) => a + b.products.reduce((c, d) => c + d.price.value, 0), 0));
            date = date.add('day', 1);
        }

        setChartData(dataList);
    };

    function selectData(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        let data = getElementsAtEvent(myChart.current, event);
        if (data.length > 0) {
            setSelectedChartData({ date: chartLabels[data[0].index], value: chartData[data[0].index] });
        }
    }

    const selectedUserRevenuePercentage = ((selectedUser.mounthOrders.filter(order => moment(order._createdAt).format('DD MMMM') == moment().format('DD MMMM')).reduce((p, v) => p + v.products.reduce((a, b) => a + b.price.value, 0), 0)) / selectedUser.totalRevenue * 100) || 0;
    const ordersPercentage = (selectedUser.mounthOrders.filter(order => moment(order._createdAt).format('DD MMMM') == moment().format('DD MMMM')).length / selectedUser.mounthOrders.length * 100) || 0;

    return (
        <div className="w-full flex flex-col items-center">
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
                            labels: chartLabels,
                            datasets: [
                                {
                                    label: 'Rainfall',
                                    fill: false,
                                    backgroundColor: '#36589d',
                                    borderColor: '#36589d',
                                    borderWidth: 2,
                                    pointBorderColor: "#36589d",
                                    pointBackgroundColor: "white",
                                    data: chartData,
                                }
                            ],

                        }}
                        className="cursor-pointer"
                    />
                </div>
                <div className={styles.chart_selected_container}>
                    <div className={styles.chart_selected_header_wrapper}>
                        <div className={styles.chart_selected_date}>{selectedChartData.date}</div>
                        <IoMdMore className={styles.chart_selected_more_btn} />
                    </div>
                    <div className={styles.chart_selected_value_wrapper}>
                        <div className={styles.chart_selected_value}>${selectedChartData.value.toFixed()}</div>
                    </div>
                    <div className={styles.chart_selectedUser_container}>
                        <div className={styles.chart_selectedUser_wrapper}>
                            <div className={styles.chart_selectedUser}>
                                <div className={styles.chart_selectedUser_image_wrapper}>
                                    <img className={styles.chart_selectedUser_image} alt="profile_image" src={selectedUser.user?.profile_image?.url || PROFILE_IMAGE_PLACEHOLDER} />
                                </div>
                                <div className={styles.chart_selectedUser_name}>{selectedUser.user.username}</div>
                                <FaChevronUp className={styles.chart_selectedUser_more} />
                            </div>
                            <div className={styles.chart_selectedUser_revenue_wrapper}>
                                <div className={styles.chart_selectedUser_revenue}>${selectedUser.totalRevenue.toFixed(2)}</div>
                                <div className={`${styles.chart_selectedUser_revenue_percent} ${selectedUserRevenuePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>{selectedUserRevenuePercentage >= 0 ? '+' : ''}{selectedUserRevenuePercentage.toFixed(2)}%</div>
                            </div>
                            <div className={styles.chart_selectedUser_revenue_title}>Revenue</div>
                        </div>
                        <div className={styles.chart_selected_processed_applications_wrapper}>
                            <div className={styles.chart_selected_processed_applications_values_wrapper}>
                                <div className={styles.chart_selected_processed_applications_value}>{selectedUser.ordersCount}</div>
                                <div className={`${styles.chart_selected_processed_applications_value_percent} ${ordersPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>{ordersPercentage >= 0 ? '+' : ''}{ordersPercentage.toFixed(2)}%</div>
                            </div>
                            <div className={styles.chart_selected_processed_applications_title}>Orders</div>
                        </div>
                    </div>
                </div>
            </div>
            <LatestOrders useSelectedChartData={[selectedChartData, setSelectedChartData]} useSelectedUser={[selectedUser, setSelectedUser]} />
        </div>
    )
}

const styles = {
    chart_container: "w-11/12 flex flex-row shadow-xl rounded-xl",
    chart_wrapper: "w-2/3 bg-white border p-5 rounded-l-lg flex flex-col",
    chart_header_wrapper: "flex flex-row pb-4",
    chart_title: "text-black text-base font-medium mx-1",
    chart_description: "text-gray-400 text-xs ml-2 self-end",
    chart_selected_container: "w-1/3 border p-5 rounded-r-lg flex flex-col items-center",
    chart_selected_header_wrapper: "w-11/12 flex flex-row items-center justify-between",
    chart_selected_date: "text-black text-base font-medium",
    chart_selected_more_btn: "text-black text-base font-medium",
    chart_selected_value_wrapper: "w-11/12 my-6",
    chart_selected_value: "text-black self-start text-2xl font-semibold",
    chart_selectedUser_container: "w-11/12 flex flex-col items-center",
    chart_selectedUser_wrapper: "w-full px-2 py-4 flex flex-col items-center rounded-tl-lg bg-gray-100",
    chart_selectedUser: "w-11/12 flex flex-row items-center",
    chart_selectedUser_image_wrapper: "h-10 w-10 rounded-full",
    chart_selectedUser_image: "h-10 w-10 rounded-full",
    chart_selectedUser_name: "flex-grow text-black font-medium ml-2",
    chart_selectedUser_more: "text-black",
    chart_selectedUser_revenue_wrapper: "flex flex-row w-11/12 items-center justify-between py-2",
    chart_selectedUser_revenue: "font-semibold text-lg text-black",
    chart_selectedUser_revenue_percent: "font-semibold text-base",
    chart_selectedUser_revenue_title: "text-gray-400 text-base w-11/12 py-2",
    chart_selected_processed_applications_wrapper: "w-full my-1 px-2 py-4 flex flex-col items-center rounded-bl-lg bg-gray-100",
    chart_selected_processed_applications_values_wrapper: "w-11/12 flex lfex-row items-center justify-between my-2",
    chart_selected_processed_applications_value: "font-semibold text-base text-black",
    chart_selected_processed_applications_value_percent: "font-semibold text-base",
    chart_selected_processed_applications_title: "w-11/12 text-sm text-gray-400 my-2",
};