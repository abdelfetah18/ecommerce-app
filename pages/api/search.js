import { getData } from "../../database/client";

export default async function handler(req, res) {
    try {
        let { query, filters } = req.body;
        
        let products_query = '*[_type=="products" && (name match $name || category->name match $name) ';
        if(filters.category)
            products_query += ' && category->name == $category';
        
        products_query += ']{ _id, name, "images": images[].asset->, category->, description, price->}'
        if(filters.order_by){
            switch(filters.order_by){
                case "price":
                    products_query += ' | order(price.value desc)';
                    break;
                case "name":
                    products_query += ' | order(name desc)';
                    break;
            }
        }

        
        let data = await getData(products_query,{ name: query+"*", category: filters.category ? filters.category.name : "" });
        res.status(200).json({ status:"success", message:"found the following products", data });
    } catch (err) {
        console.log(err);
        res.status(200).json({ status:"error", message:"something went wrong!" });
    }
}
  