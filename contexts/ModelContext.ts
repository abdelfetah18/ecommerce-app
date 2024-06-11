import { createContext } from "react";
import { UseModelReturn } from "../hooks/useModel";

export const ModelContext = createContext<UseModelReturn>({
    isOpen: false,
    open: () => { },
    close: () => { }
});