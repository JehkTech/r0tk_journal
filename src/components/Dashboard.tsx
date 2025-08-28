import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, Award } from 'lucide-react';

const mockTradeData = [
  { month: 'Jan', profit: 2400, loss: -800, trades: 45 },
  { month: 'Feb', profit: 1800, loss: -1200, trades: 38 },
  { month: 'Mar', profit: 3200, loss: -400, trades: 52 },
  { month: 'Apr', profit: 2800, loss: -900, trades: 41 },
  { month: 'May', profit: 3600, loss: -600, trades: 48 },
  { month: 'Jun', profit: 4200, loss: -300, trades: 55 }
];

const recentTrades = [
  { id: 1, pair: 'EUR/USD', side: 'Long', entry: '1.0945', exit: '1.0978', pnl: '+$330', session: 'London', emotion: 'Confident' },
  { id: 2, pair: 'GBP/JPY', side: 'Short', entry: '184.45', exit: '183.89', pnl: '+$560', session: 'Asian', emotion: 'Focused' },
  { id: 3, pair: 'USD/CAD', side: 'Long', entry: '1.3420', exit: '1.3385', pnl: '-$175', session: 'NY', emotion: 'Rushed' },
  { id: 4, pair: 'AUD/USD', side: 'Short', entry: '0.6789', exit: '0.6812', pnl: '-$115', session: 'Asian', emotion: 'Uncertain' },
  { id: 5, pair: 'EUR/GBP', side: 'Long', entry: '0.8567', exit: '0.8598', pnl: '+$310', session: 'London', emotion: 'Confident' }
];

const sessionColors = {
  'Asian': 'bg-blue-500',
  'London': 'bg-green-500',
  'NY': 'bg-orange-500'
};

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const totalPnL = 5420;
  const winRate = 67.5;
  const avgRR = 1.85;
  const totalTrades = 279;

  const handleAddTrade = () => {
    if (onNavigate) {
      onNavigate('new-trade');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            R0TK Journal
          </h1>
          <p className="text-muted-foreground mt-1">Track your trading journey with professional insights</p>
        </div>
        <Button onClick={handleAddTrade} className="bg-primary hover:bg-primary/90">
          <Calendar className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+${totalPnL.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{winRate}%</div>
            <Progress value={winRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg RR</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1:{avgRR}</div>
            <p className="text-xs text-muted-foreground">
              Risk to Reward Ratio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Trades</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Profit and loss breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#22c55e" />
                <Bar dataKey="loss" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance Curve</CardTitle>
            <CardDescription>Account balance progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your latest trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${sessionColors[trade.session as keyof typeof sessionColors]}`} />
                  <div>
                    <div className="font-medium">{trade.pair}</div>
                    <div className="text-sm text-muted-foreground">{trade.side} • {trade.session} Session</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Entry: {trade.entry}</div>
                    <div className="text-sm text-muted-foreground">Exit: {trade.exit}</div>
                  </div>
                  
                  <Badge variant={trade.pnl.startsWith('+') ? 'default' : 'destructive'} 
                         className={trade.pnl.startsWith('+') ? 'bg-green-600' : 'bg-red-600'}>
                    {trade.pnl}
                  </Badge>
                  
                  <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                    {trade.emotion}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}