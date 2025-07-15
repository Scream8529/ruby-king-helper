import React, { useState } from 'react';
import { Recipe } from '../models/recipe';
import RecipeItem from './RecipeItem';
import { TextField, Box, Pagination } from '@mui/material';

interface Props {
    recipes: Recipe[];
    onSelect: (recipe: Recipe) => void;
    selectedIds: string[];
}

const PAGE_SIZE = 50;

const RecipeList: React.FC<Props> = ({ recipes, onSelect, selectedIds }) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [expandedMap, setExpandedMap] = useState<{ [index: number]: boolean }>({});

    const filtered = recipes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleExpand = (index: number, expanded: boolean) => {
        setExpandedMap(prev => ({ ...prev, [index]: expanded }));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <TextField
                label="Поиск рецепта"
                variant="outlined"
                fullWidth
                value={search}
                onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                sx={{ mb: 2 }}
            />
            <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
            />
            {paginated.map((recipe, index) => (
                <RecipeItem
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={onSelect}
                    selected={selectedIds.includes(recipe.id)}
                    expanded={!!expandedMap[index]}
                    onExpand={expanded => handleExpand(index, expanded)}
                />
            ))}
        </Box>
    );
};

export default RecipeList;