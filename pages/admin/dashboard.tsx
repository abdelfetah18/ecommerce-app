import AdminLayout from "../../components/admin/AdminLayout";
import DashboardCards from "../../components/admin/DashboardCards";
import DashboardChart from "../../components/admin/DashboardChart";

export default function Dashboard() {
    return (
        <AdminLayout page={"dashboard"}>
            <div className={styles.container}>
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Dashboard</div>
                </div>
                <DashboardCards />
                <DashboardChart />
            </div>
        </AdminLayout>
    )
}

const styles = {
    container: "w-5/6 bg-white flex flex-col items-center overflow-auto",
    header_wrapper: "w-11/12 flex flex-row items-center justify-between mt-10",
    title: "font-medium text-lg text-black",
}