import React from 'react';
import { Recipe } from '../models/recipe';
import RecipeItem from './RecipeItem';
import { Typography, Box } from '@mui/material';

interface Props {
    recipes: Recipe[];
    onRemove: (recipe: Recipe) => void;
}

const SelectedRecipes: React.FC<Props> = ({ recipes, onRemove }) => (
    <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>Выбранные рецепты</Typography>
        {recipes.length === 0 && <Typography color="text.secondary">Нет выбранных рецептов</Typography>}
        {recipes.map(recipe => (
            <RecipeItem
                key={recipe.id}
                recipe={recipe}
                onSelect={onRemove}
                selected={true}
            />
        ))}
    </Box>
);

export default SelectedRecipes;