import React from 'react';
import { RECIPES } from '../constants/recipes';
import SelectedRecipes from '../components/SelectedRecipes';
import ResourceTracker from '../components/ResourceTracker';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Recipe } from '../models/recipe';

const Selected: React.FC = () => {
   const [selected, setSelected] = useLocalStorage<string[]>('selectedRecipes', []);
   const [collected, setCollected] = useLocalStorage<Record<string, number>>('collectedResources', {});

   const selectedRecipes = RECIPES.filter(r => selected.includes(r.id));

   // Обработка изменения количества собранного ресурса
   const handleCollect = (resourceId: string, count: number) => {
      setCollected({
         ...collected,
         [resourceId]: count
      });
   };

   const handleRemove = (recipe: Recipe) => {
      setSelected(selected.filter(id => id !== recipe.id));
   };

   return (
      <div>
         <SelectedRecipes recipes={selectedRecipes} onRemove={handleRemove} />
         <ResourceTracker
            selectedRecipes={selectedRecipes}
            collectedResources={collected}
            onCollect={handleCollect}
            allRecipes={RECIPES}
         />
      </div>
   );
};

export default Selected;