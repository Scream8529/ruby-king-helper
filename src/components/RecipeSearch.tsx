import React from 'react';
import { TextField } from '@mui/material';

interface Props {
   value: string;
   onChange: (value: string) => void;
}

const RecipeSearch: React.FC<Props> = ({ value, onChange }) => (
   <TextField
      label="Поиск рецепта"
      variant="outlined"
      fullWidth
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ mb: 2 }}
   />
);

export default RecipeSearch;