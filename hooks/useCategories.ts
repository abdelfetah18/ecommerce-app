import { useEffect, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    const axiosHttp = useAxiosHttp();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async (): Promise<void> => {
        const response = await axiosHttp.get<Category[]>("/categories");
        if (response.status == 'success') {
            setCategories(response.data);
        }
    }

    const appendNewCategory = (category: Category) => {
        setCategories(state => [...state, category]);
    }


    const removeCategoryById = (categoryId: string) => {
        setCategories(state => state.filter(c => c._id != categoryId));
    }

    return {
        categories, appendNewCategory, removeCategoryById
    }
}