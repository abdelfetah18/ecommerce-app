import { createContext } from "react";

export default createContext<UseLocalStorageReturn<string[]>>([[], () => { }]);