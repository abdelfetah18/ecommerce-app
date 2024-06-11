import { useState } from "react"

export default function useToast(): UseToastReturn {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const notify = (type: ToastMessageType, title: string, message: string): void => {
        const toastMessage: ToastMessage = { id: crypto.randomUUID(), title, message, type };

        setMessages(state => [...state, toastMessage]);

        setTimeout(() => {
            setMessages(state => [...state.filter(m => m.id != toastMessage.id)]);
        }, 3000);
    }

    const alertSuccess = (title: string, message: string): void => {
        notify('success', title, message);
    }

    const alertInfo = (title: string, message: string): void => {
        notify('info', title, message);
    }

    const alertError = (title: string, message: string): void => {
        notify('error', title, message);
    }

    return {
        messages,
        alertSuccess,
        alertError,
        alertInfo
    };
}