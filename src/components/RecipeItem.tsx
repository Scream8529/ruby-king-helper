import React, { useState } from 'react';
import { Recipe } from '../models/recipe';
import {
    Card, CardContent, CardActions, Typography, Button, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, Box, Collapse, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface RecipeItemProps {
    recipe: Recipe;
    onSelect: (recipe: Recipe) => void;
    selected: boolean;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onSelect, selected, expanded = false, onExpand }) => {
    const handleToggle = () => {
        if (onExpand) onExpand(!expanded);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={recipe.icon} alt={recipe.name} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{recipe.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{recipe.desc}</Typography>
                    </Box>
                    <Box>
                        <IconButton
                            onClick={handleToggle}
                            aria-label="expand"
                            sx={{
                                minWidth: 0,
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                ml: 1,
                            }}
                        >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Цена: {recipe.price}</Typography>
                        <Typography variant="body2">Шанс крафта: {recipe.craftChance}%</Typography>
                        <Typography variant="body2">Мин. уровень: {recipe.craftMinLvl}</Typography>
                        <List dense>
                            {recipe.craftItems.map(item => (
                                <ListItem key={item.id}>
                                    <ListItemAvatar>
                                        <Avatar src={item.icon} alt={item.name} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${item.name} x${item.count}${item.grade ? ` (${item.grade})` : ''}`}
                                        secondary={item.desc}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Collapse>
            </CardContent>
            <CardActions>
                <Button
                    variant={selected ? 'outlined' : 'contained'}
                    color="primary"
                    fullWidth
                    onClick={() => onSelect(recipe)}
                >
                    {selected ? 'Удалить' : 'Выбрать'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default RecipeItem;