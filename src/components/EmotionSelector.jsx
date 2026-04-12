import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function EmotionSelector({ emotions, value, onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="emotion-label">Emotion</InputLabel>
      <Select
        labelId="emotion-label"
        label="Emotion"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {emotions.map((emotion) => (
          <MenuItem key={emotion.id} value={emotion.id}>
            {emotion.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
