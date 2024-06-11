import { createContext } from "react";

export default createContext<UseLayoutContentsReturn>({
    bannerImageRef: null,
    bannerLayout: { banner_action_button: { name: '', type: 'text' }, banner_description: { name: '', type: 'text' }, banner_title: { name: '', type: 'text' } },
    getBannerLayout: async () => { },
    getLogoLayout: async () => { },
    isLoading: false,
    logoImageRef: null,
    logoLayout: { name: '', type: 'text' },
    setBannerLayout: () => { },
    updateBannerImage: async () => { return { isError: false } },
    updateBannerLayout: async (bannerLayout: BannerLayout) => { bannerLayout; return { isError: false } },
    updateLogo: async () => { return { isError: false } }
});