import { useEffect } from "react"
import axios from "axios";

export async function getServerSideProps(context){
    console.log("res:",context.res)
    return {
        props:{
            
        }
    }
}

export default function SignOut(){
    async function sign_out() {
        try {
            await axios.get('/api/user/sign_out');
            localStorage.removeItem("access_token");
            localStorage.removeItem("myCart");
        } catch (error) {
            console.log(error);
        } finally {
            window.location.href = "/";
        }
    }
    useEffect(() => {
        sign_out();
    });
    return(
        <div className="text-base font-medium">Sign out</div>
    )
}