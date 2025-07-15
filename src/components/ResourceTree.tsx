import React from 'react';
import {
   List, ListItem, ListItemAvatar, Avatar, ListItemText,
   Typography, Box, IconButton, Collapse, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ResourceInfo } from '../types/resourceInfo';

interface TreeProps {
   resource: ResourceInfo;
   collected: { [id: string]: number };
   handleCollect: (id: string, count: number) => void;
   expandedMap: { [id: string]: boolean };
   setExpandedMap: React.Dispatch<React.SetStateAction<{ [id: string]: boolean }>>;
   level?: number;
   onShowDetails: (resource: ResourceInfo) => void;
}

const ResourceTree: React.FC<TreeProps> = ({
   resource,
   collected,
   handleCollect,
   expandedMap,
   setExpandedMap,
   level = 0,
   onShowDetails,
}) => {
   const expanded = expandedMap[resource.id] ?? false;
   const collectedCount = collected[resource.id] || 0;

   return (
      <>
         <ListItem
            sx={{
               alignItems: { xs: 'flex-start', sm: 'center' },
               flexDirection: { xs: 'column', sm: 'row' },
               gap: 2,
               pl: 2 + level * 3,
               bgcolor:
                  collectedCount >= resource.totalCount
                     ? 'success.light'
                     : level
                     ? 'background.paper'
                     : undefined,
               border: collectedCount >= resource.totalCount ? '2px solid #4caf50' : undefined,
               minHeight: 80,
               justifyContent: { xs: 'flex-start', sm: 'space-between' },
               transition: 'background 0.2s, border 0.2s',
            }}
            key={resource.id + level}
         >
            {/* Левая часть: иконка */}
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
            {/* Центр: текст */}
            <ListItemText
               primary={resource.name}
               secondary={
                  <Box sx={{ whiteSpace: 'pre-line', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                     {resource.desc}
                  </Box>
               }
               onClick={e => {
                  e.stopPropagation();
                  onShowDetails(resource);
               }}
               sx={{
                  cursor: 'pointer',
                  mb: { xs: 1, sm: 0 },
                  flex: 1,
                  minWidth: 0,
                  mr: { sm: 2 }
               }}
            />
            {/* Правая часть: инпут и кнопка */}
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
                  value={collectedCount}
                  onChange={e => handleCollect(resource.id, Math.max(0, Number(e.target.value)))}
                  inputProps={{
                     min: 0,
                     max: resource.totalCount,
                     style: { width: '100%', maxWidth: 80 }
                  }}
                  label="Собрано"
                  sx={{ width: { xs: '100%', sm: 80 } }}
               />
               {resource.children && resource.children.length > 0 && (
                  <IconButton
                     onClick={e => {
                        e.stopPropagation();
                        setExpandedMap(prev => ({
                           ...prev,
                           [resource.id]: !expanded
                        }));
                     }}
                     size="small"
                     sx={{
                        minWidth: 0,
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        ml: { xs: 0, sm: 1 },
                        mt: { xs: 1, sm: 0 },
                     }}
                  >
                     {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
               )}
            </Box>
         </ListItem>

         {resource.children && resource.children.length > 0 && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
               <List disablePadding>
                  {resource.children.map(child =>
                     <ResourceTree
                        key={child.id + level + 1}
                        resource={child}
                        collected={collected}
                        handleCollect={handleCollect}
                        expandedMap={expandedMap}
                        setExpandedMap={setExpandedMap}
                        level={level + 1}
                        onShowDetails={onShowDetails}
                     />
                  )}
               </List>
            </Collapse>
         )}
      </>
   );
};

export default ResourceTree;