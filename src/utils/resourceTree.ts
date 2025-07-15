import { Recipe } from '../models/recipe';
import { ResourceInfo } from '../types/resourceInfo';

export function buildResourceTree(resourceId: string, count: number, allRecipes: Recipe[], parentId?: string): ResourceInfo {
    const uniqueId = parentId ? `${parentId}__${resourceId}` : resourceId;
    const recipe = allRecipes.find(r => r.craftElem === resourceId);
    if (recipe) {
        const children = recipe.craftItems.map(item =>
            buildResourceTree(item.id, item.count * count, allRecipes, uniqueId)
        );
        return {
            id: uniqueId,
            name: recipe.name || resourceId,
            icon: recipe.icon || '',
            totalCount: count,
            desc: recipe.desc,
            //  rarity: recipe.rarity,
            //  category: recipe.category,
            craftElem: recipe.craftElem,
            grade: recipe.grade,
            price: recipe.price,
            weight: recipe.weight,
            typeElement: recipe.typeElement,
            //  needExp: recipe.needExp,
            craftRecipe: recipe.craftRecipe,
            craftMinLvl: recipe.craftMinLvl,
            craftChance: recipe.craftChance,
            craftRecipeType: recipe.craftRecipeType,
            craftElemIcon: recipe.craftElemIcon,
            authorService: recipe.authorService,
            children,
        };
    } else {
        const info = allRecipes.flatMap(r => r.craftItems).find(item => item.id === resourceId);
        return {
            id: uniqueId,
            name: info?.name || resourceId,
            icon: info?.icon || '',
            totalCount: count,
            desc: info?.desc,
            // rarity: info?.rarity.,
            // category: info?.category,
            // craftElem: info?.craftElem,
            grade: info?.grade,
            price: info?.price,
            weight: info?.weight,
            typeElement: info?.typeElement,
            needExp: info?.needExp,
            craftRecipe: info?.craftRecipe,
            children: [],
        };
    }
}

export function getResourceForest(selectedRecipes: Recipe[], allRecipes: Recipe[]) {
    return selectedRecipes.map(recipe =>
        buildResourceTree(recipe.craftElem, recipe.count, allRecipes)
    );
}

export function flattenResourceTree(resources: ResourceInfo[]): ResourceInfo[] {
    const result: ResourceInfo[] = [];
    function traverse(resource: ResourceInfo) {
        result.push(resource);
        if (resource.children) {
            resource.children.forEach(traverse);
        }
    }
    resources.forEach(traverse);
    return result;
}

export function mergeResources(resources: ResourceInfo[]): ResourceInfo[] {
    const map: { [id: string]: ResourceInfo } = {};
    for (const res of resources) {
        const baseId = res.id.split('__').pop() || res.id;
        if (!map[baseId]) {
            map[baseId] = { ...res, id: baseId };
        } else {
            map[baseId].totalCount += res.totalCount;
        }
    }
    return Object.values(map);
}