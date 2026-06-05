import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type CheckStatus = 'pass' | 'warn' | 'fail';

interface SecurityCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

interface SecurityStatus {
  service: string;
  environment: string;
  generated_at: string;
  summary: {
    status: CheckStatus;
    pass: number;
    warn: number;
    fail: number;
  };
  checks: SecurityCheck[];
}

const statusStyles: Record<CheckStatus, string> = {
  pass: 'bg-green-600 text-white',
  warn: 'bg-amber-500 text-white',
  fail: 'bg-red-600 text-white'
};

const statusIcons = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: ShieldAlert
};

const defaultApiUrl = 'http://localhost:3001';

export function SecurityMonitor() {
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || defaultApiUrl,
    []
  );
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/security/status`);
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      setStatus(await response.json());
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : 'Unable to load security status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const SummaryIcon = status ? statusIcons[status.summary.status] : ShieldCheck;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Security Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Production readiness checks exposed by the backend security endpoint.
          </p>
        </div>
        <Button onClick={loadStatus} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SummaryIcon className="h-5 w-5" />
              Backend Security Status
            </CardTitle>
            <CardDescription>
              {status
                ? `${status.service} in ${status.environment}`
                : `Waiting for ${apiUrl}/api/security/status`}
            </CardDescription>
          </div>
          {status && (
            <Badge className={statusStyles[status.summary.status]}>
              {status.summary.status.toUpperCase()}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Backend status is unavailable: {error}
            </div>
          ) : status ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Passing</div>
                <div className="text-2xl font-semibold text-green-600">{status.summary.pass}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Warnings</div>
                <div className="text-2xl font-semibold text-amber-600">{status.summary.warn}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Failing</div>
                <div className="text-2xl font-semibold text-red-600">{status.summary.fail}</div>
              </div>
            </div>
          ) : (
            <div className="h-24 rounded-md border bg-muted/40" />
          )}
        </CardContent>
      </Card>

      {status && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {status.checks.map((check) => {
            const Icon = statusIcons[check.status];

            return (
              <Card key={check.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{check.label}</CardTitle>
                      <CardDescription>{check.detail}</CardDescription>
                    </div>
                  </div>
                  <Badge className={statusStyles[check.status]}>
                    {check.status.toUpperCase()}
                  </Badge>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
