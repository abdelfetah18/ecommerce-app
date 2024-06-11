type OrderState = 'Order Placed' | 'Payment Processed' | 'Order Confirmed' | 'Shipped' | 'Delivered' | 'Order Completed' | 'Order Cancelled' | 'Refund Processed';

type OrderStateColors = {
    [key in OrderState]: string;
};

interface Order {
    _id?: string;
    payment_method: string;
    user?: User;
    state: OrderState;
    products: Product[];
    _createdAt?: string;
};