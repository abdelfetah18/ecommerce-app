import client from "../database/client";

export const LAYOUT_CONTENTS_PROPS = `{ _id, name, type, content, "image" : image.asset-> }`;

export const getLayoutContentByName = async (name: string): Promise<LayoutContent | null> => {
    return await client.fetch<LayoutContent>(`*[_type == "layout_contents" && name == $name]${LAYOUT_CONTENTS_PROPS}[0]`, { name });
}

export const getBannerLayoutContent = async (): Promise<BannerLayout | null> => {
    return await client.fetch<BannerLayout>(`{
        "banner_title": *[_type == "layout_contents" && name == "banner_title"]${LAYOUT_CONTENTS_PROPS}[0],
        "banner_description": *[_type == "layout_contents" && name == "banner_description"]${LAYOUT_CONTENTS_PROPS}[0],
        "banner_action_button": *[_type == "layout_contents" && name == "banner_action_button"]${LAYOUT_CONTENTS_PROPS}[0],
        "banner_image": *[_type == "layout_contents" && name == "banner_image"]${LAYOUT_CONTENTS_PROPS}[0],
    }`);
}

export const updateBannerLayoutContent = async (bannerLayout: BannerLayout): Promise<BannerLayout | null> => {
    const bannerTitleDoc = { _type: "layout_contents", ...bannerLayout.banner_title };
    const bannerDescriptionDoc = { _type: "layout_contents", ...bannerLayout.banner_description };
    const bannerActionButtonDoc = { _type: "layout_contents", ...bannerLayout.banner_action_button };

    await client.patch(bannerLayout.banner_title._id).set(bannerTitleDoc).commit();
    await client.patch(bannerLayout.banner_description._id).set(bannerDescriptionDoc).commit();
    await client.patch(bannerLayout.banner_action_button._id).set(bannerActionButtonDoc).commit();

    return await getBannerLayoutContent();
}

export const updateLayoutContent = async (layoutContent: LayoutContent): Promise<void> => {
    const image = layoutContent.image ? { _type: 'image', asset: { _type: "reference", _ref: layoutContent.image._id } } : undefined;
    const layoutContentDoc = { _type: "layout_contents", ...layoutContent, image };
    await client.patch(layoutContent._id).set(layoutContentDoc).commit();
}