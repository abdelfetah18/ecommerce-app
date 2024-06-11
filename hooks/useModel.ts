import { useState } from "react";

export interface UseModelReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export default function useModel(): UseModelReturn {
    const [isOpen, setIsOpen] = useState(false);

    const open = (): void => {
        setIsOpen(true);
    }

    const close = (): void => {
        setIsOpen(false);
    }

    return {
        isOpen, open, close
    }
}