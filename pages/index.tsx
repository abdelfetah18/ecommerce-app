import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Header from "../components/Header";
import { useState } from "react";
import useProducts from "../hooks/useProducts";
import Loading from "../components/Loading";
import Product from "../components/Product";
import ProductModel from "../components/ProductModel";
import useModel from "../hooks/useModel";
import { getBannerLayoutContent } from "../repositories/layout_contents_repository";

export async function getServerSideProps() {
  const bannerLayout = await getBannerLayoutContent();
  return { props: { bannerLayout } };
}

interface HomeProps {
  bannerLayout: BannerLayout;
};

export default function Home({ bannerLayout }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { products, isLoading } = useProducts(selectedCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product>({ name: '', category: { name: '' }, images: [], price: { currency: 'USD', value: 0 } });
  const useModelValue = useModel();

  return (
    <div className="w-full h-screen flex flex-col items-center overflow-auto bg-slate-50 dark:bg-[#252936]">
      <Header />
      <Banner bannerLayout={bannerLayout} />
      <div className="w-11/12 flex flex-col mt-16">
        <div className="text-lg text-black">{"Today Best Selling Product!"}</div>
        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <div className="flex flex-wrap mt-8 min-h-[386px]">
          {
            isLoading && (
              <div className="w-full flex items-center justify-center">
                <Loading />
              </div>
            )
          }
          {
            (!isLoading && products.length == 0) && (
              <div className="w-full text-center self-start text-black text-sm">No Products found.</div>
            )
          }
          {
            products.map((product, index) => {
              const onClick = (): void => {
                setSelectedProduct(product);
                useModelValue.open();
              }

              return (
                <div key={index} className="w-1/6 px-2 pb-10">
                  <Product product={product} onClick={onClick} />
                </div>
              )
            })
          }
        </div>
      </div>
      <ProductModel useModelValue={useModelValue} product={selectedProduct} />
    </div>
  )
}