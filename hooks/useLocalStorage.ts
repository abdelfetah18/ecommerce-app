import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        const v = localStorage.getItem(key);
        if (v) {
            setValue(JSON.parse(v) as T);
        }
    }, []);

    const updateValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    }

    return [value, updateValue];
}