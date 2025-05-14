import {compressToEncodedURIComponent} from "lz-string";
import { GroceryList } from "../types/grocery";

export const generateShareUrl = (list: GroceryList): string => {
    const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL || "/"}`;
    const safeBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const encodedData = compressToEncodedURIComponent(JSON.stringify(list));
    return `${safeBaseUrl}import?data=${encodedData}`;
};