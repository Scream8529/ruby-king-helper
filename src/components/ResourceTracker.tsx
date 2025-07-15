import React, { useState, useCallback } from 'react';
import {
   List, ListItem, ListItemAvatar, Avatar, ListItemText,
   Typography, Box, TextField, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { Recipe } from '../models/recipe';
import { ResourceInfo } from '../types/resourceInfo';
import ResourceTree from './ResourceTree';
import {
   getResourceForest,
   flattenResourceTree,
   mergeResources
} from '../utils/resourceTree';

interface Props {
   selectedRecipes: Recipe[];
   collectedResources: { [id: string]: number };
   onCollect: (resourceId: string, count: number) => void;
   allRecipes: Recipe[];
}

const ResourceTracker: React.FC<Props> = ({
   selectedRecipes,
   collectedResources,
   onCollect,
   allRecipes
}) => {
   const [expandedMap, setExpandedMap] = useState<{ [id: string]: boolean }>({});
   const [view, setView] = useState<'tree' | 'list'>('tree');
   const [details, setDetails] = useState<ResourceInfo | null>(null);

   const handleCollect = useCallback((id: string, count: number) => {
      onCollect(id, count);
   }, [onCollect]);

   const handleShowDetails = (resource: ResourceInfo) => {
      setDetails(resource);
   };

   const handleCloseDetails = () => setDetails(null);

   const resourceForest = getResourceForest(selectedRecipes, allRecipes);
   const flatResources = flattenResourceTree(resourceForest);
   const mergedResources = mergeResources(flatResources);

   return (
      <Box sx={{ mt: 2 }}>
         <Typography variant="h6" gutterBottom>
            Осталось собрать ресурсы:
         </Typography>
         <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            sx={{ mb: 2 }}
         >
            <ToggleButton value="tree">Дерево</ToggleButton>
            <ToggleButton value="list">Список</ToggleButton>
         </ToggleButtonGroup>
         {view === 'tree' ? (
            <List>
               {resourceForest.map(resource =>
                  <ResourceTree
                     key={resource.id}
                     resource={resource}
                     collected={collectedResources}
                     handleCollect={handleCollect}
                     expandedMap={expandedMap}
                     setExpandedMap={setExpandedMap}
                     onShowDetails={handleShowDetails}
                  />
               )}
            </List>
         ) : (
            <List>
               {mergedResources.map(resource => {
                  const collectedCount = collectedResources[resource.id] || 0;
                  return (
                     <ListItem
                        key={resource.id}
                        sx={{
                           flexDirection: { xs: 'column', sm: 'row' },
                           alignItems: { xs: 'flex-start', sm: 'center' },
                           gap: 2,
                           minHeight: 80,
                           bgcolor:
                              collectedCount >= resource.totalCount
                                 ? 'success.light'
                                 : 'background.paper',
                           border: collectedCount >= resource.totalCount ? '2px solid #4caf50' : undefined,
                           transition: 'background 0.2s, border 0.2s',
                        }}
                     >
                        <ListItemAvatar sx={{ position: 'relative', minWidth: 56, mr: { sm: 2 } }}>
                           <Avatar
                              src={resource.icon}
                              alt={resource.name}
                              sx={{
                                 width: 48,
                                 height: 48,
                                 mb: { xs: 1, sm: 0 }
                              }}
                           />
                           <Box
                              sx={{
                                 position: 'absolute',
                                 bottom: 2,
                                 right: 2,
                                 bgcolor: 'grey.300',
                                 color: 'text.primary',
                                 borderRadius: 1,
                                 px: 0.5,
                                 py: 0.2,
                                 fontSize: '0.85rem',
                                 minWidth: 22,
                                 minHeight: 22,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 boxShadow: 1,
                              }}
                           >
                              {resource.totalCount}
                           </Box>
                        </ListItemAvatar>
                        <ListItemText
                           primary={resource.name}
                           secondary={
                              <Box sx={{ whiteSpace: 'pre-line', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                                 {resource.desc}
                              </Box>
                           }
                           onClick={e => {
                              e.stopPropagation();
                              handleShowDetails(resource);
                           }}
                           sx={{
                              cursor: 'pointer',
                              mb: { xs: 1, sm: 0 },
                              flex: 1,
                              minWidth: 0,
                              mr: { sm: 2 }
                           }}
                        />
                        <Box
                           sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              gap: 1,
                              width: { xs: '100%', sm: 'auto' },
                              mt: { xs: 1, sm: 0 },
                              minWidth: { sm: 160 }
                           }}
                        >
                           <TextField
                              type="number"
                              size="small"
                              value={collectedResources[resource.id] || 0}
                              onChange={e => handleCollect(resource.id, Math.max(0, Number(e.target.value)))}
                              inputProps={{
                                 min: 0,
                                 max: resource.totalCount,
                                 style: { width: '100%', maxWidth: 80 }
                              }}
                              label="Собрано"
                              sx={{ width: { xs: '100%', sm: 80 } }}
                           />
                        </Box>
                     </ListItem>
                  );
               })}
            </List>
         )}
         <Dialog open={!!details} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
            <DialogTitle>{details?.name}</DialogTitle>
            <DialogContent>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={details?.icon} alt={details?.name} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Typography variant="body1">{details?.name}</Typography>
               </Box>
               <Typography variant="body2">ID: {details?.id}</Typography>
               <Typography variant="body2">Нужно: {details?.totalCount}</Typography>
               <Typography variant="body2">Описание: {details?.desc}</Typography>
               {/* Добавьте другие поля по желанию */}
            </DialogContent>
         </Dialog>
      </Box>
   );
};

export default ResourceTracker;