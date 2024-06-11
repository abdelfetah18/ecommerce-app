import { useEffect, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useProducts(selectedCategory: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    const axiosHttp = useAxiosHttp();

    useEffect(() => {
        setProducts([]);
        getProducts(selectedCategory);
    }, [selectedCategory]);

    const getProducts = async (selectedCategory: string): Promise<void> => {
        setIsLoading(true);
        let url = '/products';
        if (selectedCategory.toLowerCase() != 'all') {
            url += `?category_id=${selectedCategory}`;
        }

        const response = await axiosHttp.get<Product[]>(url);
        if (response.status == 'success') {
            setProducts(response.data);
        }

        setIsLoading(false);
    }

    const deleteProduct = async (productId: string): Promise<ErrorOr<undefined>> => {
        const errorOr: ErrorOr<undefined> = { isError: false };

        setIsProcessing(true);
        const response = await axiosHttp.post<{ productId: string }, Category>("/admin/products/delete", { productId });
        if (response.status == 'success') {
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        setIsProcessing(false);

        return errorOr;
    }

    const removeProduct = (productId: string) => {
        setProducts(state => state.filter(p => p._id != productId));
    }

    return { isLoading, isProcessing, products, deleteProduct, removeProduct };
}