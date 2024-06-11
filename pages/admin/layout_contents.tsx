import { useContext, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import EditBanner from "../../components/admin/EditBanner";
import EditLogo from "../../components/admin/EditLogo";
import Loading from "../../components/Loading";
import LayoutContentsContext from "../../contexts/LayoutContentsContext";

export default function LayoutContentsPage() {
    const {
        bannerLayout,
        setBannerLayout,
        bannerImageRef,
        logoLayout,
        getBannerLayout,
        getLogoLayout,
        logoImageRef,
        updateLogo,
        isLoading,
        updateBannerImage,
        updateBannerLayout
    } = useContext(LayoutContentsContext);

    useEffect(() => {
        getBannerLayout();
        getLogoLayout();
    }, []);

    return (
        <AdminLayout page={"layout_contents"}>
            <div className={styles.container}>
                {
                    isLoading && (
                        <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                            <Loading />
                        </div>
                    )
                }
                <div className={styles.header_wrapper} >
                    <div className={styles.title} >Layout Contents</div>
                </div>
                <div className="w-11/12 flex flex-col my-4">
                    <div className="text-xl mb-4">Logo:</div>
                    <div className="w-full rounded-lg overflow-hidden">
                        <EditLogo logoLayout={logoLayout} logoFileRef={logoImageRef} updateLogo={updateLogo} />
                    </div>
                </div>
                <div className="w-11/12 flex flex-col my-4">
                    <div className="text-xl mb-4">Banner Layout:</div>
                    <EditBanner
                        useBannerLayout={[bannerLayout, setBannerLayout]}
                        bannerImageRef={bannerImageRef}
                        updateBannerImage={updateBannerImage}
                        updateBannerLayout={updateBannerLayout}
                    />
                </div>
            </div>
        </AdminLayout>
    )
}

const styles = {
    container: "w-5/6 bg-white flex flex-col items-center overflow-auto",
    header_wrapper: "w-11/12 flex flex-row items-center justify-between mt-10",
    title: "font-medium text-lg text-black",
}