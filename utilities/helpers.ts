export const createFileFromUrl = async (url: string): Promise<File> => {
    const response = await fetch(url);
    
    const blob = await response.blob();
    
    const fileName = crypto.randomUUID();
    const file = new File([blob], fileName, { type: blob.type });

    return file;
}