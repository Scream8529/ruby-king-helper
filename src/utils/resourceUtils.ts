import { Recipe } from '../models/recipe';

export function getNeededResources(recipes: Recipe[]): string[] {
    return Array.from(new Set(recipes.flatMap(r => r.craftItems.map(item => item.id))));
}

export function getRemainingResources(recipes: Recipe[], collected: string[]): string[] {
    const needed = getNeededResources(recipes);
    return needed.filter(res => !collected.includes(res));
}