import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EmotionSelector from './EmotionSelector';
import DocumentUploader from './DocumentUploader';
import { useUser } from '../lib/context/UserContext';

const INITIAL_FORM = {
  symbol: '',
  killzone: '',
  open: '',
  close: '',
  risk: '',
  notes: '',
  emotionId: 1,
  documents: [],
};

export default function JournalForm({ onEntryCreated }) {
  const { accountId, emotions } = useUser();
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        ...form,
        accountId,
        open: Number(form.open),
        close: Number(form.close),
        risk: Number(form.risk),
        emotionId: Number(form.emotionId),
      };

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to save journal entry.');
      }

      const savedEntry = await response.json();
      setStatus({ type: 'success', message: 'Journal entry saved.' });
      setForm(INITIAL_FORM);
      if (onEntryCreated) {
        onEntryCreated(savedEntry);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1">
          New Trade Entry
        </Typography>

        {status.message ? <Alert severity={status.type}>{status.message}</Alert> : null}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Symbol"
              value={form.symbol}
              onChange={updateField('symbol')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Killzone"
              value={form.killzone}
              onChange={updateField('killzone')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Open"
              type="number"
              inputProps={{ step: '0.01' }}
              value={form.open}
              onChange={updateField('open')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Close"
              type="number"
              inputProps={{ step: '0.01' }}
              value={form.close}
              onChange={updateField('close')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Risk"
              type="number"
              inputProps={{ step: '0.01' }}
              value={form.risk}
              onChange={updateField('risk')}
            />
          </Grid>
          <Grid item xs={12}>
            <EmotionSelector
              emotions={emotions}
              value={form.emotionId}
              onChange={(emotionId) => setForm((previous) => ({ ...previous, emotionId }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Notes"
              value={form.notes}
              onChange={updateField('notes')}
            />
          </Grid>
          <Grid item xs={12}>
            <DocumentUploader
              files={form.documents}
              onUpload={(documents) => setForm((previous) => ({ ...previous, documents }))}
            />
          </Grid>
        </Grid>

        <Box>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
