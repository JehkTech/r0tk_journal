import Link from 'next/link';
import { Button, Stack, Typography } from '@mui/material';
import JournalForm from '../components/JournalForm';

export default function JournalPage() {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h4" component="h1">
          Journal Entry
        </Typography>
        <Button component={Link} href="/dashboard" variant="outlined">
          View Dashboard
        </Button>
      </Stack>
      <JournalForm />
    </Stack>
  );
}
