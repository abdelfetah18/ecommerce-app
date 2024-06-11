type ToastMessageType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: string;
    title: string;
    message: string;
    type: ToastMessageType
};

interface UseToastReturn {
    messages: ToastMessage[],
    alertSuccess: (title: string, message: string) => void;
    alertError: (title: string, message: string) => void;
    alertInfo: (title: string, message: string) => void;
};