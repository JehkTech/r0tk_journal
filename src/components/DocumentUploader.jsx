import { Button, Stack, Typography } from '@mui/material';

function formatNames(files) {
  return files.map((file) => file.name);
}

export default function DocumentUploader({ onUpload, files }) {
  const onChange = (event) => {
    const pickedFiles = Array.from(event.target.files || []);
    onUpload(formatNames(pickedFiles));
  };

  return (
    <Stack spacing={1}>
      <Button component="label" variant="outlined">
        Upload supporting files
        <input
          hidden
          multiple
          accept="application/pdf,image/png,image/jpeg"
          type="file"
          onChange={onChange}
        />
      </Button>
      <Typography variant="caption" color="text.secondary">
        {files.length ? files.join(', ') : 'No files selected'}
      </Typography>
    </Stack>
  );
}
