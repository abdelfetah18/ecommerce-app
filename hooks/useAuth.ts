import { useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const axiosHttp = useAxiosHttp();

    const signIn = async (userCredentials: UserCredentials): Promise<ErrorOr<UserSession>> => {
        let errorOr: ErrorOr<UserSession> = { isError: true };
        setIsLoading(true);

        try {
            const response = await axiosHttp.post<UserCredentials, UserSession>("/user/sign_in", userCredentials);
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

    const signInAsGuest = async (): Promise<ErrorOr<UserSession>> => {
        let errorOr: ErrorOr<UserSession> = { isError: true };

        try {
            const response = await axiosHttp.get<UserSession>("/user/guest");
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
        isLoading,
        signIn,
        signInAsGuest
    }
}