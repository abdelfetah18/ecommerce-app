import useDashboard from "../../hooks/useDashboard";
import DashboardCard from "./DashboardCard";

export default function DashboardCards() {
    const { dashboardStats } = useDashboard();

    return (
        <div className={styles.info_wrapper}>
            <DashboardCard
                data={{
                    title: 'Daily Revenue',
                    percent: dashboardStats.todayRevenuePercentage,
                    value: `$${dashboardStats.todayRevenue.toFixed(2)}`
                }}
            />
            <DashboardCard
                data={{
                    title: 'Total Revenue',
                    percent: dashboardStats.totalRevenuePercentage,
                    value: `$${dashboardStats.totalRevenue.toFixed(2)}`
                }}
            />
            <DashboardCard
                data={{
                    title: 'Total Customers',
                    value: `${dashboardStats.totalCustomers}`,
                    percent: dashboardStats.totalCustomersPercentage
                }}
            />
        </div>
    )
}

const styles = {
    info_wrapper: "w-11/12 my-5 flex flex-row"
}