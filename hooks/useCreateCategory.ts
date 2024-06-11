import { useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useCreateCategory() {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<Category>({ name: '' });

    const axiosHttp = useAxiosHttp();

    const createCategory = async (): Promise<ErrorOr<Category>> => {
        const errorOr: ErrorOr<Category> = { isError: false };

        setIsLoading(true);
        const response = await axiosHttp.post<Category, Category>("/admin/categories/create", category);
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

    const deleteCategory = async (categoryId: string): Promise<ErrorOr<undefined>> => {
        const errorOr: ErrorOr<undefined> = { isError: false };

        setIsLoading(true);
        const response = await axiosHttp.post<{ categoryId: string }, Category>("/admin/categories/delete", { categoryId });
        if (response.status == 'success') {
            errorOr.message = response.message;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        setIsLoading(false);

        return errorOr;
    }

    return {
        category, setCategory, createCategory, isLoading, deleteCategory
    }
}