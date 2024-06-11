import { Dispatch, SetStateAction } from "react";
import useCategories from "../hooks/useCategories";

interface CategoriesProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

export default function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps) {
  const { categories } = useCategories();

  return (
    <div className="flex items-center flex-wrap mt-8">
      <div onClick={() => setSelectedCategory('all')} className={`px-8 py-2 rounded-full cursor-pointer active:scale-105 duration-300 capitalize mr-2 mb-2 ${selectedCategory == 'all' ? 'text-white bg-primary-color' : 'text-black bg-gray-200'}`}>All</div>
      {
        categories.map((category, index) => {
          const isSelected = category._id == selectedCategory;

          return (
            <div key={index} onClick={() => setSelectedCategory(category._id)} className={`px-8 py-2 rounded-full cursor-pointer active:scale-105 duration-300 capitalize mr-2 mb-2 ${isSelected ? 'text-white bg-primary-color' : 'text-black bg-gray-200'}`}>{category.name}</div>
          )
        })
      }
    </div>
  )
}