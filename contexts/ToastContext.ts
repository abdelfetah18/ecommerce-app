import { createContext } from "react";

export default createContext<UseToastReturn>({
    messages: [],
    alertSuccess: (title: string, message: string): void => { title; message },
    alertInfo: (title: string, message: string): void => { title; message },
    alertError: (title: string, message: string): void => { title; message },
});