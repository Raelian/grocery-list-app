import localforage from "localforage";
import { GroceryList} from "../types/grocery";

const LISTS_KEY = "groceryLists";

//save lists to local storage
export const saveLists = async (lists: GroceryList[]) => {
    await localforage.setItem(LISTS_KEY, lists); //saves lists under the key 'groceryLists
};

//load lists from local storage
export const loadLists = async (): Promise<GroceryList[]> => {
    const data = await localforage.getItem<GroceryList[]>(LISTS_KEY);
    return data ?? []; //if no lists found, return an empty array
};