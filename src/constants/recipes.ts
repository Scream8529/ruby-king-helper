import { Recipe, CraftItem } from '../models/recipe';
import recipesData from './data.json';

// Проверка и фильтрация craftItems
function normalizeCraftItems(items: any[]): CraftItem[] {
    return (items ?? []).map(item => ({
        originalResId: item.originalResId ?? '',
        count: item.count ?? 0,
        id: item.id ?? '',
        typeElement: item.typeElement ?? '',
        name: item.name ?? '',
        weight: item.weight ?? 0,
        icon: item.icon ?? '',
        price: item.price ?? 0,
        desc: item.desc ?? '',
        grade: item.grade,
        needExp: item.needExp,
        craftRecipe: item.craftRecipe,
    }));
}

// Проверка и фильтрация рецептов
function normalizeRecipe(obj: any): Recipe {
    return {
        id: obj.id ?? '',
        typeElement: obj.typeElement ?? '',
        name: obj.name ?? '',
        weight: obj.weight ?? 0,
        icon: obj.icon ?? '',
        price: obj.price ?? 0,
        desc: obj.desc ?? '',
        isRecipe: obj.isRecipe ?? false,
        craftElem: obj.craftElem ?? '',
        craftRecipe: obj.craftRecipe ?? '',
        craftRecipeType: obj.craftRecipeType ?? '',
        craftChance: obj.craftChance ?? 0,
        craftMinLvl: obj.craftMinLvl ?? 0,
        craftItems: normalizeCraftItems(obj.craftItems),
        grade: obj.grade,
        count: obj.count ?? 1,
        _id: obj._id,
        craftPrice: obj.craftPrice,
        craftElemIcon: obj.craftElemIcon,
        authorService: obj.authorService,
    };
}

export const RECIPES: Recipe[] = (recipesData as any[]).map(normalizeRecipe);