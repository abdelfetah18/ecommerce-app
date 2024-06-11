import { useState } from "react";
import useAxiosHttp from "./useAxiosHttp";

export default function useOrder() {
    const axiosHttp = useAxiosHttp();

    const [order, setOrder] = useState<Order>({ payment_method: '', products: [], state: 'Order Placed' });
    const [isLoading, setIsLoading] = useState(true);


    const updateOrderState = async (orderId: string, orderState: OrderState): Promise<ErrorOr<undefined>> => {
        const errorOr: ErrorOr<undefined> = { isError: false };

        setIsLoading(true);

        const response = await axiosHttp.post<{ order_id: string, state: OrderState }, undefined>('/admin/change_state', { order_id: orderId, state: orderState });
        if (response.status == 'success') {
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        setIsLoading(false);

        return errorOr
    }

    return { updateOrderState };
}