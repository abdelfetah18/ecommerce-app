import { useRef, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useCreateProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState<Product>({ name: '', category: { name: '' }, images: [], price: { value: 0, currency: 'DZD' } });
    const productImages = useRef<File[]>([]);

    const axiosHttp = useAxiosHttp();

    const createProduct = async (): Promise<ErrorOr<Product>> => {
        setIsLoading(true);
        let errorOr: ErrorOr<Product> = { isError: false };
        let images: Asset[] = [];
        if (productImages.current.length > 0) {
            const formData = new FormData();

            productImages.current.forEach((image) => {
                formData.append(`images`, image);
            });

            const uploadResponse = await axiosHttp.post<FormData, Asset[]>('/admin/products/upload_images', formData);
            if (uploadResponse.status == 'success') {
                images = uploadResponse.data;
            }
        }

        const response = await axiosHttp.post<Product, Product>('/admin/products/create', { ...product, images });
        if (response.status == 'success') {
            errorOr.value = response.data;
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        setIsLoading(false);
        return errorOr;
    }

    return {
        product, setProduct, createProduct, productImages, isLoading
    }
}