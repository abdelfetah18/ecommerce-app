import Header from "../../components/admin/Header";
import Navigation from "../../components/admin/Navigation";
import Categories from "../../components/admin/Categories";

export default function Categories_(){
    return(
        <div className={styles.container}>
            <Navigation page={"categories"}/>
            <Categories />
        </div>
    )
}

const styles = {
    container:"w-screen flex flex-row h-screen",
}