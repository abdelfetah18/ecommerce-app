import { SanityDocument, SanityDocumentStub } from "@sanity/client";
import client from "../database/client";

const CATEGORY_PROPS = '{ _id, name, icon }';

export const getCategories = async (): Promise<Category[] | null> => {
    return client.fetch(`*[_type == "categories"]${CATEGORY_PROPS}`);
}

export const createCategory = async (category: Category): Promise<SanityDocument<Category>> => {
    const categoryDoc: SanityDocumentStub<Category> = { _type: "categories", ...category };
    return await client.create(categoryDoc);
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
    await client.delete(categoryId);
}
