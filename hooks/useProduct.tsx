import { useEffect, useRef, useState } from "react";
import useAxiosHttp from "./useAxiosHttp";
import { createFileFromUrl } from "../utilities/helpers";

export default function useProduct(productId?: string) {
    const axiosHttp = useAxiosHttp();

    const [product, setProduct] = useState<Product>({ name: '', images: [], category: { name: '' }, price: { currency: 'USD', value: 0 } });
    const [isLoading, setIsLoading] = useState(true);
    const productImages = useRef<File[]>([]);

    useEffect(() => {
        if (productId?.length > 0) {
            getProductById();
        }
        setIsLoading(false);
    }, [productId]);

    const getProductById = async (): Promise<void> => {
        setIsLoading(true);

        const response = await axiosHttp.get<Product>(`/admin/products/${productId}`);
        if (response.status == 'success') {
            setProduct(response.data);
            productImages.current = await Promise.all(response.data.images.map(async (image) => await createFileFromUrl(image.url)));
        }

        setIsLoading(false);
    }

    const hasNewImages = (): boolean => {
        const image = product.images.find(img => img._id == undefined);
        if (image != undefined) {
            return true;
        }
        return false;
    }

    const updateProduct = async (): Promise<ErrorOr<Product>> => {
        setIsLoading(true);
        let errorOr: ErrorOr<Product> = { isError: false };
        let images: Asset[] = [];
        let indexes: number[] = [];
        if (hasNewImages()) {
            const formData = new FormData();

            productImages.current.forEach((image, index) => {
                const canAppend = product.images[index]._id == undefined;
                if (canAppend) {
                    formData.append(`image_${index}`, image);
                    indexes.push(index);
                }
            });

            const uploadResponse = await axiosHttp.post<FormData, Asset[]>('/admin/products/upload_images', formData);
            if (uploadResponse.status == 'success') {
                let data = uploadResponse.data;
                // Note: This works because the indexes are sequential
                product.images.forEach((img, index) => {
                    if (indexes.includes(index)) {
                        images.push(data.shift());
                    } else {
                        images.push(img);
                    }
                });
            }
        } else {
            images = product.images;
        }

        const response = await axiosHttp.post<Product, Product>('/admin/products/update', { ...product, images });
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

    return { product, setProduct, isLoading, productImages, updateProduct };
}