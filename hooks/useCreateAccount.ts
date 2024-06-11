import { useState } from "react";
import useAxiosHttp from "./useAxiosHttp";

export default function useCreateAccount() {
    const [user, setUser] = useState<User>({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const axiosHttp = useAxiosHttp();

    const signUp = async (): Promise<ErrorOr<undefined>> => {
        let errorOr: ErrorOr<undefined> = { isError: true };
        setIsLoading(true);

        try {
            const response = await axiosHttp.post<User, undefined>("/user/sign_up", user);
            if (response.status === "success") {
                errorOr.isError = false;
                errorOr.value = response.data;
                errorOr.message = response.message;
            } else {
                errorOr.message = response.message;
            }
        } catch (err) {
            errorOr.message = 'Something went wrong';
            console.log(err);
        }

        setIsLoading(false);
        return errorOr;
    }

    return {
        user,
        setUser,
        isLoading,
        signUp
    };
}