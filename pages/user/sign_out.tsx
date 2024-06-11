import { useRouter } from "next/router";
import { useContext, useEffect } from "react"
import UserSessionContext from "../../contexts/UserSessionContext";

export default function SignOut() {
    const router = useRouter();
    const { clearSession } = useContext(UserSessionContext);

    useEffect(() => {
        clearSession();
        router.push('/user/sign_in');
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
            <div className="text-black text-xl">Sign Out...</div>
        </div>
    )
}