import React from 'react';
import { RECIPES } from '../constants/recipes';
import SelectedRecipes from '../components/SelectedRecipes';
import ResourceTracker from '../components/ResourceTracker';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Recipe } from '../models/recipe';

const Selected: React.FC = () => {
   const [selected, setSelected] = useLocalStorage<string[]>('selectedRecipes', []);
   const [collected, setCollected] = useLocalStorage<string[]>('collectedResources', []);

   const selectedRecipes = RECIPES.filter(r => selected.includes(r.id));

   // Обработка групповой отметки из ResourceTracker
   const handleCollect = (resourceIds: string[], checked: boolean) => {
      if (checked) {
         // Добавить все resourceIds, без дублей
         setCollected(Array.from(new Set([...collected, ...resourceIds])));
      } else {
         // Удалить все resourceIds
         setCollected(collected.filter(id => !resourceIds.includes(id)));
      }
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