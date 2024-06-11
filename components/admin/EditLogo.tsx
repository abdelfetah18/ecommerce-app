import { MutableRefObject, useContext, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import ToastContext from "../../contexts/ToastContext";

interface EditLogoProps {
    logoLayout: LayoutContent;
    logoFileRef: MutableRefObject<File | null>;
    updateLogo: () => Promise<ErrorOr<LayoutContent>>;
};

export default function EditLogo({ logoLayout, logoFileRef, updateLogo }: EditLogoProps) {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const toastManager = useContext(ToastContext);

    const selectImageHandler = () => {
        logoInputRef.current.click();
    }

    const onSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        logoFileRef.current = event.target.files[0];
        const result = await updateLogo();
        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", result.message);
        }
    }

    return (
        <div className="w-full flex flex-col">
            <input ref={logoInputRef} onChange={onSelectImage} type="file" accept="images/*" hidden />
            <div className="relative w-40 h-40 rounded-full bg-white border">
                <img src={logoLayout?.image?.url || "/logo.png"} className="w-full h-full rounded-full object-contain" />
                <div onClick={selectImageHandler} className="absolute right-0 bottom-0 bg-primary-color rounded-full p-3 text-white cursor-pointer active:scale-105 select-none">
                    <FaCamera />
                </div>
            </div>
        </div>
    )
}