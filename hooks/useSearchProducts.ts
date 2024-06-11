import { useEffect, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useSearchProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const axiosHttp = useAxiosHttp();

    const search = async (query: string, filters: ProductsFilter): Promise<void> => {
        setIsLoading(true);
        const response = await axiosHttp.post<{ query: string, filters: ProductsFilter }, Product[]>('/search', { query, filters });
        if (response.status == 'success') {
            setProducts(response.data);
        }

        setIsLoading(false);
    }

    return { isLoading, products, search };
}