export type Unit = '' | 'kg';

export const units: Unit[] = ['', 'kg']

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