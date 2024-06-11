import moment from "moment";
import client from "../database/client";
import { PRODUCT_PROPS } from "./products_repository";
import { USER_PROPS } from "./users_repository";
import { SanityDocument, SanityDocumentStub } from "@sanity/client";

export const ORDER_PROPS = `{ _id, state, products[]->${PRODUCT_PROPS}, payment_method, user->${USER_PROPS},_createdAt }`;

export const getUserOrdersByState = async (userId: string, orderState: OrderState): Promise<Order[] | null> => {
    return await client.fetch(`*[_type=="orders" && user._ref == $userId && state == $orderState]${ORDER_PROPS}`, { userId, orderState });
}


export const getUserOrders = async (userId: string): Promise<Order[] | null> => {
    return await client.fetch(`*[_type=="orders" && user._ref == $userId]${ORDER_PROPS}`, { userId });
}

export const getTodayOrders = async (): Promise<Order[] | null> => {
    let today = new Date();

    let dd = (today.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
    let mm = (today.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    let yy = today.getFullYear();

    const query = `*[_type=="orders" && state != "Not Processing" && _createdAt >= $today]${ORDER_PROPS}`;

    return await client.fetch(query, { today: `${yy}-${mm}-${dd}` });
}

export const getLastMounthUserOrders = async (userId: string): Promise<Order[] | null> => {
    const monthAgo = moment().subtract('month', 1);
    return await client.fetch(`*[_type=="orders" && user._ref == $userId && dateTime(_createdAt) >= dateTime($monthAgo)]{ _id, _createdAt, products[]->${PRODUCT_PROPS}, payment_method, state, user->${USER_PROPS} }`, { userId, monthAgo });
}


export const getLastOrders = async (): Promise<Order[] | null> => {
    return await client.fetch(`*[_type=="orders"]${ORDER_PROPS}[0..4] | order(_createdAt desc)`);
}

export const getOrders = async (): Promise<Order[] | null> => {
    return await client.fetch(`*[_type=="orders"]${ORDER_PROPS} | order(_createdAt desc)`);
}

export const getUserChart = async (userId: string): Promise<ChartUser | null> => {
    const monthAgo = moment().subtract('month', 1);
    return await client.fetch(`{
      "mounthOrders": *[_type=="orders" && user._ref == $userId && dateTime(_createdAt) >= dateTime($monthAgo)]${ORDER_PROPS},
      "user": *[_type=="users" && _id==$userId]${USER_PROPS}[0],
      "totalRevenue": math::sum(*[_type=="orders" && user._ref==$userId].products[]->price->value),
      "ordersCount": count(*[_type=="orders" && user._ref==$userId])
    }`, { userId, monthAgo });
}

export const createOrder = async (order: Order): Promise<Order> => {
    const orderDoc = { _type: "orders", state: 'Order Placed', payment_method: 'Stripe', products: order.products.map(p => ({ _type: 'reference', _ref: p._id })), user: { _type: 'reference', _ref: order.user._id } };
    const createdOrder = await client.create(orderDoc);
    return getOrderById(createdOrder._id);
}

export const getOrderById = async (orderId: string): Promise<Order> => {
    return await client.fetch(`*[_type=="orders" && _id==$orderId]${ORDER_PROPS}[0]`, { orderId });
}


export const updateOrderState = async (orderId: string, orderState: OrderState): Promise<void> => {
    await client.patch(orderId).set({ state: orderState }).commit();
}