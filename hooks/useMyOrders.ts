import { useEffect, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useMyOrders() {
    const axiosHttp = useAxiosHttp();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedState, setSelectedState] = useState<OrderState | 'all'>('all');

    useEffect(() => {
        getMyOrders();
    }, [selectedState]);

    const getMyOrders = async (): Promise<void> => {
        setIsLoading(true);

        const path = selectedState == "all" ? `/user/orders` : `/user/orders?state=${selectedState}`;
        const response = await axiosHttp.get<Order[]>(path);

        if (response.status == 'success') {
            setOrders(response.data);
        }

        setIsLoading(false);
    }

    return {
        isLoading,
        orders,
        selectedState, setSelectedState
    }
}