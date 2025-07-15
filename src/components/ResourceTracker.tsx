import React, { useState, useCallback } from 'react';
import { Recipe } from '../models/recipe';
import {
   Checkbox, List, ListItem, ListItemAvatar, Avatar, ListItemText,
   Typography, Box, IconButton, Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Props {
   selectedRecipes: Recipe[];
   collectedResources: string[];
   onCollect: (resourceId: string[], checked: boolean) => void;
   allRecipes: Recipe[];
}

type ResourceInfo = {
   id: string;
   name: string;
   icon: string;
   totalCount: number;
   children?: ResourceInfo[];
};

// Рекурсивно собираем дерево ресурсов
function buildResourceTree(resourceId: string, count: number, allRecipes: Recipe[]): ResourceInfo {
   // Ищем рецепт для этого ресурса
   const recipe = allRecipes.find(r => r.craftElem === resourceId);
   if (recipe) {
      // Если есть рецепт, собираем детей
      const children = recipe.craftItems.map(item =>
         buildResourceTree(item.id, item.count * count, allRecipes)
      );
      return {
         id: resourceId,
         name: recipe.name || resourceId,
         icon: recipe.icon || '',
         totalCount: count,
         children,
      };
   } else {
      // Если нет рецепта — это базовый ресурс
      const info = allRecipes.flatMap(r => r.craftItems).find(item => item.id === resourceId);
      return {
         id: resourceId,
         name: info?.name || resourceId,
         icon: info?.icon || '',
         totalCount: count,
      };
   }
}

// Собираем дерево для всех выбранных рецептов
function getResourceForest(selectedRecipes: Recipe[], allRecipes: Recipe[]) {
   const roots: ResourceInfo[] = [];
   for (const recipe of selectedRecipes) {
      roots.push(buildResourceTree(recipe.craftElem, recipe.count, allRecipes));
   }
   return roots;
}

// Проверка: отмечены ли все дочерние элементы
function areAllChildrenChecked(resource: ResourceInfo, checkedSet: Set<string>): boolean {
   if (!resource.children || resource.children.length === 0) return checkedSet.has(resource.id);
   return resource.children.every(child => areAllChildrenChecked(child, checkedSet));
}

// Рекурсивная отметка всех дочерних
function getAllDescendantIds(resource: ResourceInfo): string[] {
   let ids = [resource.id];
   if (resource.children) {
      for (const child of resource.children) {
         ids = ids.concat(getAllDescendantIds(child));
      }
   }
   return ids;
}

// Рекурсивный компонент для отображения дерева
function ResourceTree({
   resource,
   checkedSet,
   handleCheck,
   expandedMap,
   setExpandedMap,
   level = 0,
}: {
   resource: ResourceInfo;
   checkedSet: Set<string>;
   handleCheck: (ids: string[], checked: boolean) => void;
   expandedMap: { [id: string]: boolean };
   setExpandedMap: React.Dispatch<React.SetStateAction<{ [id: string]: boolean }>>;
   level?: number;
}) {
   const expanded = expandedMap[resource.id] ?? false;

   // Отметка чекбокса
   const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      const ids = getAllDescendantIds(resource);
      handleCheck(ids, checked);
   };

   // Если все дочерние отмечены, отмечаем родителя
   const checked = areAllChildrenChecked(resource, checkedSet);

   return (
      <>
         <ListItem
            sx={{
               alignItems: 'center',
               pl: 2 + level * 3,
               bgcolor: level ? 'background.paper' : undefined,
            }}
            key={resource.id + level}
            secondaryAction={
               <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: 32 }}>
                  x{resource.totalCount}
               </Typography>
            }
         >
            <Checkbox
               edge="start"
               checked={checked}
               indeterminate={
                  resource.children && resource.children.length > 0 &&
                  !checked && resource.children.some(child => areAllChildrenChecked(child, checkedSet))
               }
               onChange={handleCheckbox}
               tabIndex={-1}
               sx={{ mr: 1 }}
            />
            <ListItemAvatar>
               <Avatar src={resource.icon} alt={resource.name} />
            </ListItemAvatar>
            <ListItemText primary={resource.name} />
            {resource.children && resource.children.length > 0 && (
               <IconButton
                  onClick={() => setExpandedMap(prev => ({
                     ...prev,
                     [resource.id]: !expanded
                  }))}
                  size="small"
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
            )}
         </ListItem>

         {resource.children && resource.children.length > 0 && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
               <List disablePadding>
                  {resource.children.map(child =>
                     <ResourceTree
                        key={child.id + level + 1}
                        resource={child}
                        checkedSet={checkedSet}
                        handleCheck={handleCheck}
                        expandedMap={expandedMap}
                        setExpandedMap={setExpandedMap}
                        level={level + 1}
                     />
                  )}
               </List>
            </Collapse>
         )}
      </>
   );
}

const ResourceTracker: React.FC<Props> = ({
   selectedRecipes,
   collectedResources,
   onCollect,
   allRecipes
}) => {
   const [expandedMap, setExpandedMap] = useState<{ [id: string]: boolean }>({});
   const checkedSet = new Set(collectedResources);

   // Групповая отметка
   const handleCheck = useCallback((ids: string[], checked: boolean) => {
      if (checked) {
         const newSet = Array.from(new Set([...collectedResources, ...ids]));
         onCollect(newSet, true);
      } else {
         const newSet = collectedResources.filter(id => !ids.includes(id));
         onCollect(newSet, false);
      }
   }, [collectedResources, onCollect]);

   const resourceForest = getResourceForest(selectedRecipes, allRecipes);

   return (
      <Box sx={{ mt: 2 }}>
         <Typography variant="h6" gutterBottom>
            Осталось собрать ресурсы:
         </Typography>
         <List>
            {resourceForest.map(resource =>
               <ResourceTree
                  key={resource.id}
                  resource={resource}
                  checkedSet={checkedSet}
                  handleCheck={handleCheck}
                  expandedMap={expandedMap}
                  setExpandedMap={setExpandedMap}
               />
            )}
         </List>
      </Box>
   );
};

export default ResourceTracker;