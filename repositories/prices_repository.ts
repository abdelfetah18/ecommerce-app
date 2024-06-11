import { SanityDocument, SanityDocumentStub } from "@sanity/client";
import client from "../database/client";

export const PRICE_PROPS = `{ _id, value, currency }`;

export const createPrice = async (price: Price): Promise<SanityDocument<Price>> => {
    const priceDoc: SanityDocumentStub<Price> = { _type: "prices", ...price };
    return await client.create(priceDoc);
}

export const deletePrice = async (priceId: string): Promise<void> => {
    await client.delete(priceId);
}