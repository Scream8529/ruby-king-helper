import React from 'react';
import { RECIPES } from '../constants/recipes';
import RecipeList from '../components/RecipeList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Recipe } from '../models/recipe';

const Home: React.FC = () => {
    const [selected, setSelected] = useLocalStorage<string[]>('selectedRecipes', []);

    const handleSelect = (recipe: Recipe) => {
        if (!selected.includes(recipe.id)) {
            setSelected([...selected, recipe.id]);
        }
    };

    return (
        <div>
            <RecipeList
                recipes={RECIPES}
                onSelect={handleSelect}
                selectedIds={selected}
            />
        </div>
    );
};

export default Home;