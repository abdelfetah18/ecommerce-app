import { SanityDocument } from "@sanity/client";
import client from "../database/client";
import { PRICE_PROPS } from "./prices_repository";

export const PRODUCT_PROPS = `{ _id, name, "images": images[].asset->, category-> , description, price->${PRICE_PROPS}, "sells": count(*[_type=="orders" && (^._id in products[]._ref)]) }`;

export const getProducts = async (): Promise<Product[] | null> => {
    return await client.fetch<Product[]>(`*[_type == "products"]${PRODUCT_PROPS}`);
}

export const getProductsByCategoryId = async (categoryId: string): Promise<Product[] | null> => {
    return await client.fetch<Product[]>(`*[_type == "products" && category._ref == $categoryId]${PRODUCT_PROPS}`, { categoryId });
}

export const getProductsByFilters = async (query: string, filters: ProductsFilter): Promise<Product[] | null> => {
    let products_query = '*[_type=="products" && (name match $query || category->name match $query) ';
    if (filters.category.length > 0) {
        products_query += ' && category->name == $category';
    }

    products_query += `]${PRODUCT_PROPS}`;
    if (filters.order_by.length > 0) {
        switch (filters.order_by) {
            case "price":
                products_query += ' | order(price.value desc)';
                break;
            case "name":
                products_query += ' | order(name desc)';
                break;
        }
    }

    return await client.fetch<Product[]>(products_query, { query: `*${query}*`, category: filters.category || "" });
}

export const getProductById = async (productId: string): Promise<Product> => {
    return await client.fetch<Product>(`*[_type=="products" && _id==$productId]${PRODUCT_PROPS}[0]`, { productId });
}

export const createProduct = async (product: Product): Promise<Product> => {
    let productDoc = { _type: "products", ...product, price: { _ref: product.price._id }, category: { _ref: product.category._id }, images: product.images.map(image => ({ _type: 'image', asset: { _type: "reference", _ref: image._id } })) };
    const newProduct = await client.create(productDoc);
    return await getProductById(newProduct._id);
}

export const deleteProduct = async (productId: string): Promise<void> => {
    await client.delete(productId);
}

export const updateProduct = async (product: Product): Promise<Product> => {
    let productDoc = { _type: "products", ...product, price: { _ref: product.price._id }, category: { _ref: product.category._id }, images: product.images.map(image => ({ _type: 'image', asset: { _type: "reference", _ref: image._id } })) };
    await client.patch(product._id).set(productDoc).commit();
    return await getProductById(product._id);
}