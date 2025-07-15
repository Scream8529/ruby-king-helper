export interface CraftItem {
    originalResId: string;
    count: number;
    id: string;
    typeElement: string;
    name: string;
    weight: number;
    icon: string;
    price: number;
    desc: string;
    grade?: string;
    needExp?: number;
    craftRecipe?: string;
}

export interface Recipe {
    id: string;
    typeElement: string;
    name: string;
    weight: number;
    icon: string;
    price: number;
    desc: string;
    isRecipe: boolean;
    craftElem: string;
    craftRecipe: string;
    craftRecipeType: string;
    craftChance: number;
    craftMinLvl: number;
    craftItems: CraftItem[];
    grade?: string;
    count: number;
    _id?: string;
    craftPrice?: number;
    craftElemIcon?: string;
    authorService?: string;
}