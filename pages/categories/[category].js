import { useState } from "react";
import Categories from "../../components/Categories";
import Header from "../../components/Header";
import Search from "../../components/Search";
import Shop from "../../components/Shop";
import { getCategories, getProductsByCategory, getUser } from "../../database/client";
import { decodeJwt } from "jose";

export async function getServerSideProps({ req,params }){
  let category_name = params.category;
  if(req.cookies.access_token != undefined){
    let user_session = decodeJwt(req.cookies.access_token);
    let products = await getProductsByCategory(category_name);
    let categories = await getCategories();
    let user = await getUser(user_session.user_id);
    
    return { props:{ products, category_name, categories, user }};
  }else{
    return {
      redirect: {
        destination: '/user/sign_in',
        permanent: false,
      },
    }
  }
}

export default function Home({ products, category_name, categories, user, theme, setTheme }) {
  const [_products,setProducts] = useState(products);

  return (
    <div className="w-screen h-screen flex flex-col items-center overflow-auto bg-slate-50 dark:bg-[#252936]">
      <Header user={user} theme={theme} setTheme={setTheme} />
      <Categories category_name={category_name} categories={categories} />
      <div className="flex flex-row w-11/12 mt-10 flex-grow">
        <Search search={[_products,setProducts]} categories={categories} />
        <Shop category_name={category_name} products={_products} />
      </div>
    </div>
  )
}