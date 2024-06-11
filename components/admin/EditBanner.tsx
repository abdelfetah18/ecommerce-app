import { FaCamera, FaChevronRight, FaEdit } from 'react-icons/fa';
import { PLACEHOLDER_IMAGE } from '../../utilities/consts';
import { Dispatch, MutableRefObject, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import Banner from '../Banner';
import ToastContext from '../../contexts/ToastContext';

interface BannerProps {
    useBannerLayout: [BannerLayout, Dispatch<SetStateAction<BannerLayout>>];
    bannerImageRef: MutableRefObject<File | null>;
    updateBannerImage: () => Promise<ErrorOr<LayoutContent>>;
    updateBannerLayout: (bannerLayout: BannerLayout) => Promise<ErrorOr<BannerLayout>>;
};

export default function EditBanner({ useBannerLayout, bannerImageRef, updateBannerImage, updateBannerLayout }: BannerProps) {
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [bannerLayout, setBannerLayout] = useBannerLayout;
    const [draftBannerLayout, setDraftBannerLayout] = useState<BannerLayout>(bannerLayout);
    const [canEdit, setCanEdit] = useState(false);
    const toastManager = useContext(ToastContext);

    useEffect(() => {
        setDraftBannerLayout(bannerLayout);
    }, [bannerLayout]);

    const selectBannerImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        bannerImageRef.current = event.target.files[0];
        if (bannerImageRef.current) {
            setDraftBannerLayout(state => ({ ...state, banner_image: { ...state.banner_image, image: { url: URL.createObjectURL(bannerImageRef.current) } } }))
            setBannerLayout(state => ({ ...state, banner_image: { ...state.banner_image, image: { url: URL.createObjectURL(bannerImageRef.current) } } }))
        }
    }

    const saveButtonHandler = async () => {
        const result = await updateBannerLayout(draftBannerLayout);
        if (bannerImageRef.current) {
            await updateBannerImage();
        }

        if (result.isError) {
            toastManager.alertError("Error", result.message);
        } else {
            toastManager.alertSuccess("Success", result.message);
        }

        setCanEdit(false);
    }

    return (
        <div className='w-full flex flex-col'>
            {
                canEdit ? (
                    <div className="w-full h-96 flex flex-col items-center bg-gray-100 rounded-lg">
                        <div className="w-11/12 h-full flex items-center">
                            <div className="w-1/2 h-full overflow-auto flex flex-col justify-center">
                                <textarea
                                    placeholder='Enter a banner title...'
                                    className='h-fit text-xl font-semibold whitespace-pre-line outline-none resize-none bg-gray-200 focus:bg-gray-300 rounded-lg mb-8'
                                    rows={draftBannerLayout.banner_title.content.split("\n").length}
                                    value={draftBannerLayout.banner_title.content}
                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        setDraftBannerLayout(state => ({ ...state, banner_title: { ...state.banner_title, content: event.target.value } }));
                                    }}
                                />

                                <textarea
                                    placeholder='Enter a banner description...'
                                    className='leading-5 whitespace-pre-line outline-none resize-none bg-gray-200 focus:bg-gray-300 rounded-lg mb-8'
                                    rows={draftBannerLayout.banner_description.content.split("\n").length}
                                    value={draftBannerLayout.banner_description.content}
                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        setDraftBannerLayout(state => ({ ...state, banner_description: { ...state.banner_description, content: event.target.value } }));
                                    }}
                                />

                                <div className="flex items-center text-primary-color">
                                    <input
                                        type='text'
                                        placeholder='Enter a banner action button...'
                                        className='bg-gray-200 focus:bg-gray-300 rounded-lg outline-none'
                                        style={{
                                            width: `${draftBannerLayout.banner_action_button.content.length}ch`
                                        }}
                                        value={draftBannerLayout.banner_action_button.content}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setDraftBannerLayout(state => ({ ...state, banner_action_button: { ...state.banner_action_button, content: event.target.value } }));
                                        }}
                                    />

                                    <div>
                                        <FaChevronRight />
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 h-full relative">
                                <input ref={imageInputRef} onChange={selectBannerImage} hidden type='file' accept='images/*' />
                                <img src={draftBannerLayout.banner_image.image.url || PLACEHOLDER_IMAGE} className='h-full object-cover' />
                                <div onClick={() => imageInputRef.current.click()} className='absolute right-0 bottom-2 bg-primary-color rounded-full h-10 w-10 flex items-center justify-center cursor-pointer active:scale-125 duration-300 select-none'>
                                    <div className='text-white'><FaCamera /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Banner bannerLayout={bannerLayout} />
                )
            }

            {
                canEdit ? (
                    <div className='my-4 flex items-center'>
                        <button onClick={saveButtonHandler} className='px-16 py-2 rounded-full border border-primary-color bg-primary-color text-white cursor-pointer active:scale-105 duration-300 text-sm'>Save</button>
                        <button onClick={() => { setCanEdit(false); setDraftBannerLayout(bannerLayout); }} className='px-16 py-2 rounded-full border border-primary-color text-primary-color cursor-pointer active:scale-105 duration-300 text-sm ml-2'>Cancel</button>
                    </div>
                ) : (
                    <div className='my-4 flex items-center'>
                        <button onClick={() => setCanEdit(true)} className='px-16 py-2 rounded-full border border-yellow-500 bg-yellow-500 text-white cursor-pointer active:scale-105 duration-300 flex items-center text-sm'>
                            <div className='mr-2'><FaEdit /></div>
                            <div>Edit Banner Layout</div>
                        </button>
                    </div>
                )
            }
        </div>
    )
}