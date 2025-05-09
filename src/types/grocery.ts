export type Unit = '' | 'kg' | 'lbs' | 'buc' | 'pcs';

export const units: Unit[] = ['', 'kg', 'lbs', 'buc', 'pcs']

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