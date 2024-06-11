import { useEffect, useRef, useState } from "react"
import useAxiosHttp from "./useAxiosHttp";

export default function useLayoutContents(): UseLayoutContentsReturn {
    const axiosHttp = useAxiosHttp();

    const [isLoading, setIsLoading] = useState(false);
    const [logoLayout, setLogoLayout] = useState<LayoutContent>({ name: 'logo', type: 'image' });
    const [bannerLayout, setBannerLayout] = useState<BannerLayout>({
        "banner_title": {
            content: "Mix. Match.\nMagSafe.",
            name: "banner_title",
            type: "text"
        },
        "banner_description": {
            name: "banner_description",
            type: "text",
            content: "Snap on a case, wallet, or\nwireless charger."
        },
        banner_action_button: {
            name: "banner_action_button",
            type: "text",
            content: "Shop MagSafe"
        },
        banner_image: {
            image: {
                url: "https://cdn.sanity.io/images/a6hagb75/production/a5866bca643989cabe50564fbcc746d154413918-1080x480.png",
            },
            name: "banner_image",
            type: "image"
        }
    });

    const bannerImageRef = useRef<File | null>(null);
    const logoImageRef = useRef<File | null>(null);

    const getBannerLayout = async (): Promise<void> => {
        setIsLoading(true);
        const response = await axiosHttp.get<BannerLayout>('/admin/layout_contents/banner');
        if (response.status == 'success') {
            setBannerLayout(response.data);
        }
        setIsLoading(false);
    }

    const getLogoLayout = async (): Promise<void> => {
        setIsLoading(true);
        const response = await axiosHttp.get<LayoutContent>('/admin/layout_contents?name=logo');
        if (response.status == 'success') {
            setLogoLayout(response.data);
        }
        setIsLoading(false);
    }

    const updateLogo = async (): Promise<ErrorOr<LayoutContent>> => {
        const errorOr: ErrorOr<LayoutContent> = { isError: false };

        setIsLoading(true);
        const formData = new FormData();
        formData.append('logo', logoImageRef.current);
        const response = await axiosHttp.post<FormData, LayoutContent>('/admin/layout_contents/update_logo', formData);
        if (response.status == 'success') {
            setLogoLayout(response.data);
            errorOr.message = response.message;
            errorOr.value = response.data;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }
        setIsLoading(false);

        return errorOr;
    }

    const updateBannerLayout = async (bannerLayout: BannerLayout): Promise<ErrorOr<BannerLayout>> => {
        const errorOr: ErrorOr<BannerLayout> = { isError: false };

        setIsLoading(true);
        const response = await axiosHttp.post<BannerLayout, BannerLayout>('/admin/layout_contents/update_banner', bannerLayout);
        if (response.status == 'success') {
            setBannerLayout(state => ({ ...response.data, banner_image: state.banner_image }));
            errorOr.message = response.message;
            errorOr.value = response.data;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }
        setIsLoading(false);

        return errorOr;
    }

    const updateBannerImage = async (): Promise<ErrorOr<LayoutContent>> => {
        const errorOr: ErrorOr<LayoutContent> = { isError: false };

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', bannerImageRef.current);
        const response = await axiosHttp.post<FormData, LayoutContent>('/admin/layout_contents/update_banner_image', formData);
        if (response.status == 'success') {
            setBannerLayout(state => ({ ...state, banner_image: response.data }));
            errorOr.message = response.message;
            errorOr.value = response.data;
        } else {
            errorOr.isError = true;
            errorOr.message = response.message;
        }
        setIsLoading(false);

        return errorOr;
    }

    return {
        bannerLayout,
        setBannerLayout,
        bannerImageRef,
        logoLayout,
        getBannerLayout,
        getLogoLayout,
        updateLogo,
        logoImageRef,
        isLoading,
        updateBannerImage,
        updateBannerLayout
    };
}