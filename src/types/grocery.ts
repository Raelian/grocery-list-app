export type Unit = "" | "kg" | "g" | "lbs" | "oz" | "L" | "ml" |"pcs";

export const units: Unit[] = ["", "kg", "g", "lbs", "oz", "L", "ml", "pcs"]

export interface GroceryItem {
    
    id: string;
    name: string;
    quantity: number;
    checked: boolean;
    unit: Unit;
}

export interface GroceryList {
    id: string;
    name: string;
    items: GroceryItem[];
    creationDate: string;
    lastModified: string;
}