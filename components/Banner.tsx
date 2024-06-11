import { FaChevronRight } from 'react-icons/fa';
import { BANNER_IMAGE, PLACEHOLDER_IMAGE } from '../utilities/consts';

interface BannerProps {
    bannerLayout: BannerLayout;
};

export default function Banner({ bannerLayout }: BannerProps) {
    return (
        <div className="w-full h-96 flex flex-col items-center bg-gray-100">
            <div className="w-11/12 h-full flex items-center">
                <div className="w-1/2 h-full flex flex-col justify-center">
                    <div className='text-xl font-semibold whitespace-pre-line mb-8'>{bannerLayout.banner_title.content}</div>
                    <div className='leading-5 whitespace-pre-line mb-8'>{bannerLayout.banner_description.content}</div>
                    <div className="flex items-center text-primary-color">
                        <div>{bannerLayout.banner_action_button.content}</div>
                        <div>
                            <FaChevronRight />
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-full">
                    <img src={bannerLayout.banner_image.image.url || PLACEHOLDER_IMAGE} className='h-full object-cover' />
                </div>
            </div>
        </div>
    )
}