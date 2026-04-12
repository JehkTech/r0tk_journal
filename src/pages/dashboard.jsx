import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

function calculateWinRate(entries) {
  if (entries.length === 0) {
    return 0;
  }

  const wins = entries.filter((entry) => Number(entry.close) > Number(entry.open)).length;
  return Math.round((wins / entries.length) * 100);
}

export default function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch('/api/journal');
        if (!response.ok) {
          throw new Error('Failed to load dashboard data.');
        }
        const data = await response.json();
        setEntries(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadEntries();
  }, []);

  const metrics = useMemo(() => {
    const totalRisk = entries.reduce((sum, entry) => sum + Number(entry.risk || 0), 0);
    const averageRisk = entries.length ? (totalRisk / entries.length).toFixed(2) : '0.00';

    return {
      totalTrades: entries.length,
      winRate: calculateWinRate(entries),
      averageRisk,
    };
  }, [entries]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button component={Link} href="/journal" variant="contained">
          Add Entry
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Trades</Typography>
              <Typography variant="h4">{metrics.totalTrades}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Win Rate</Typography>
              <Typography variant="h4">{metrics.winRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Average Risk</Typography>
              <Typography variant="h4">{metrics.averageRisk}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Emotion</TableCell>
                <TableCell>Open</TableCell>
                <TableCell>Close</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.symbol}</TableCell>
                  <TableCell>{entry.emotion?.name || 'N/A'}</TableCell>
                  <TableCell>{entry.open}</TableCell>
                  <TableCell>{entry.close}</TableCell>
                  <TableCell>{entry.risk}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No entries yet. Add your first trade.</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
