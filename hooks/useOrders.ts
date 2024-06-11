import { useState } from "react";
import useAxiosHttp from "./useAxiosHttp";

export default function useOrders() {
    const axiosHttp = useAxiosHttp();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    const getLastOrders = async (): Promise<void> => {
        setIsLoading(true);

        const response = await axiosHttp.get<Order[]>('/admin/last_orders');
        if (response.status == 'success') {
            setOrders(response.data);
        }

        setIsLoading(false);
    }

    const getUserRevenue = async (userId: string): Promise<ErrorOr<ChartUser>> => {
        const errorOr: ErrorOr<ChartUser> = { isError: false };

        const response = await axiosHttp.post<{ userId: string }, ChartUser>('/admin/get_user_revenue', { userId });
        if (response.status == 'success') {
            errorOr.value = response.data;
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        return errorOr;
    }

    const getOrders = async (): Promise<void> => {
        const response = await axiosHttp.get<Order[]>('/admin/orders');
        if (response.status == 'success') {
            setOrders(response.data);
        }
    }

    return {
        orders, isLoading, getLastOrders, getUserRevenue, getOrders
    };
}