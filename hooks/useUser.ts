import { useContext, useRef, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";
import UserSessionContext from "../contexts/UserSessionContext";

export default function useUser() {
    const { userSession, updateUserSession } = useContext(UserSessionContext);
    const [user, setUser] = useState<User>({ username: '', email: '' });
    const profileImageRef = useRef<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const axiosHttp = useAxiosHttp();

    const getUserWithEmail = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await axiosHttp.get<User>("/user");
            if (response.status === "success") {
                setUser(response.data);
            }
        } catch (err) {
            console.log(err);
        }

        setIsLoading(false);
    }

    const updateUser = async (user: User): Promise<ErrorOr<User>> => {
        const errorOr: ErrorOr<User> = { isError: false };

        setIsLoading(true);
        let image = user.profile_image;
        if (profileImageRef.current) {
            const formData = new FormData();
            formData.append('profileImage', profileImageRef.current);
            const uploadResponse = await axiosHttp.post<FormData, Asset>('/user/upload_profile_image', formData);
            if (uploadResponse.status == 'success') {
                image = uploadResponse.data;
                setUser(state => ({ ...state, profile_image: uploadResponse.data }));
            }
        }
        const response = await axiosHttp.post<User, User>("/user", { ...user, profile_image: image });
        if (response.status === "success") {
            errorOr.message = response.message;
            errorOr.value = response.data;
            setUser(response.data);
            updateUserSession({ ...userSession, user: response.data });
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }

        setIsLoading(false);

        return errorOr;
    }

    return {
        user,
        setUser,
        isLoading,
        getUserWithEmail,
        updateUser,
        profileImageRef
    }
}