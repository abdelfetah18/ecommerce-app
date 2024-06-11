import { useEffect, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initDashboardStats);

    const axiosHttp = useAxiosHttp();

    useEffect(() => {
        getDashboardStats();
    }, []);

    const getDashboardStats = async (): Promise<void> => {
        setIsLoading(true);

        const response = await axiosHttp.get<DashboardStats>('/admin/dashboard');
        if (response.status == 'success') {
            setDashboardStats(response.data);
        }

        setIsLoading(false);
    }

    return { isLoading, dashboardStats };
}

const initDashboardStats: DashboardStats = {
    todayRevenue: 0,
    todayRevenuePercentage: 0,
    totalCustomers: 0,
    totalCustomersPercentage: 0,
    totalRevenue: 0,
    totalRevenuePercentage: 0
};