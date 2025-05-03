export interface GroceryItem {
    id: string;
    name: string;
    checked: boolean;
}

export interface GroceryList {
    id: string;
    name: string;
    completed: boolean;
    items: GroceryItem[];
}