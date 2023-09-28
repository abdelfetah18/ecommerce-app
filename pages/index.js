import Categories from "../components/Categories";
import Header from "../components/Header";
import Search from "../components/Search";
import Shop from "../components/Shop";
import { getCategories, getProducts, getUser } from "../database/client";
import { decodeJwt } from "jose";
import { useState } from "react";

export async function getServerSideProps({ req }){
  const user_session = decodeJwt(req.cookies.access_token);
  const products = await getProducts();
  const categories = await getCategories();
  const user = await getUser(user_session.user_id);

  return { props: { products, categories, user } };
}

export default function Home({ products, categories, user, theme, setTheme }) {
  const category_name = "All";
  var [_products,setProducts] = useState(products);

  return (
    <div className="w-full h-screen flex flex-col items-center overflow-auto bg-slate-50 dark:bg-[#252936]">
      <Header user={user} theme={theme} setTheme={setTheme} />
      <Categories category_name={category_name} categories={categories} />
      <div className="flex flex-row w-11/12 mt-10 flex-grow">
        <Search search={[_products,setProducts]} categories={categories} />
        <Shop category_name={category_name} products={_products} />
      </div>
    </div>
  )
}