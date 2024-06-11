type ContentType = 'text' | 'image';

interface LayoutContent {
    _id?: string;
    name: string;
    type: ContentType;
    content?: string;
    image?: Asset;
};

interface BannerLayout {
    banner_title: LayoutContent;
    banner_description: LayoutContent;
    banner_action_button: LayoutContent;
    banner_image?: LayoutContent;
};

interface UseLayoutContentsReturn {
    bannerLayout: BannerLayout;
    setBannerLayout: Dispatch<SetStateAction<BannerLayout>>;
    bannerImageRef: MutableRefObject<File | null>;
    logoLayout: LayoutContent;
    getBannerLayout: () => Promise<void>;
    getLogoLayout: () => Promise<void>;
    updateLogo: () => Promise<ErrorOr<LayoutContent>>;
    logoImageRef: MutableRefObject<File | null>;
    isLoading: boolean;
    updateBannerImage: () => Promise<ErrorOr<LayoutContent>>;
    updateBannerLayout: (bannerLayout: BannerLayout) => Promise<ErrorOr<BannerLayout>>;
};