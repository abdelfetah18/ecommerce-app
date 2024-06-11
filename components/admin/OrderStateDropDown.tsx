import { motion, AnimatePresence } from "framer-motion";
import { ORDER_STATES } from "../../utilities/consts";
import useOrder from "../../hooks/useOrder";
import { Dispatch, SetStateAction, useContext } from "react";
import ToastContext from "../../contexts/ToastContext";

interface OrderStateDropDownProps {
    useOrder_: [Order, Dispatch<SetStateAction<Order>>];
    useCanEdit: [boolean, Dispatch<SetStateAction<boolean>>];
}

export default function OrderStateDropDown({ useOrder_, useCanEdit }: OrderStateDropDownProps) {
    const [order, setOrder] = useOrder_;
    const orderId = order._id;
    const [canEdit, setCanEdit] = useCanEdit;
    const { updateOrderState } = useOrder();
    const toastManager = useContext(ToastContext);

    const updateStateHandler = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        event.preventDefault();

        setOrder(state => ({ ...state, state: orderState }));

        const orderState = event.target.value as OrderState;
        const response = await updateOrderState(orderId, orderState);

        setCanEdit(false);

        if (response.isError) {
            toastManager.alertError("Error", response.message);
        } else {
            toastManager.alertSuccess("Success", response.message);
        }
    }

    return (
        <div>
            <AnimatePresence>
                {
                    canEdit && (
                        <motion.div
                            variants={{
                                open: {
                                    opacity: 1,
                                    transition: { duration: 0.3 },
                                    marginTop: 0
                                },
                                close: {
                                    opacity: 0,
                                    transition: { duration: 0.3 },
                                    marginTop: -10
                                },
                            }}
                            initial='close'
                            animate='open'
                            exit='close'
                            className={styles.states_wrapper}>
                            <select onChange={updateStateHandler} className="outline-none bg-transparent" value={order.state}>
                                <option value="Select Order State" disabled selected>Select Order State</option>


                                {
                                    ORDER_STATES.map((value, index) => {
                                        return (
                                            <option key={index} value={value} className="text-black">{value}</option>
                                        )
                                    })
                                }
                            </select>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

const styles = {
    states_wrapper: "rounded-lg p-1 flex-col items-center bg-transparent select-none",
    states: "w-full px-4 py-2 cursor-pointer hover:bg-gray-300 rounded-full rounded-lg text-center active:scale-110 duration-300"
};