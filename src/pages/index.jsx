import Link from 'next/link';
import { Button, Paper, Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Trading Journal MVP
        </Typography>
        <Typography color="text.secondary">
          Capture trades, emotions, and risk to build a repeatable review workflow.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={Link} href="/journal" variant="contained">
            Log New Trade
          </Button>
          <Button component={Link} href="/dashboard" variant="outlined">
            Open Dashboard
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
