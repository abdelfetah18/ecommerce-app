interface Product {
    _id?: string;
    name: string;
    images: Asset[];
    category: Category;
    description?: string;
    price: Price;
    sells?: number;
};

interface ProductsFilter {
    category: string;
    order_by: string;
}