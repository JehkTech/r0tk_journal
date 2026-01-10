import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, Award } from 'lucide-react';
import { useTrades } from '../lib/hooks/useTrades';
import { useAuth } from '../context/AuthContext';

const sessionColors: Record<string, string> = {
  'Asian': 'bg-blue-500',
  'London': 'bg-green-500',
  'NY': 'bg-orange-500',
  'Overlap': 'bg-purple-500'
};

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { trades, isLoading } = useTrades(user?.id);

  const handleAddTrade = () => {
    if (onNavigate) {
      onNavigate('new-trade');
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        avgRR: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0
      };
    }

    const winningTrades = trades.filter(t => t.profit_loss > 0);
    const losingTrades = trades.filter(t => t.profit_loss < 0);
    const totalPnL = trades.reduce((sum, t) => sum + t.profit_loss, 0);
    const avgRR = trades.reduce((sum, t) => sum + t.rr_ratio, 0) / trades.length;

    return {
      totalPnL,
      winRate: trades.length > 0 ? Math.round((winningTrades.length / trades.length) * 100) : 0,
      avgRR: parseFloat(avgRR.toFixed(2)),
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  }, [trades]);

  // Generate monthly performance data
  const monthlyData = useMemo(() => {
    const months: Record<string, { profit: number; loss: number; trades: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = monthNames[date.getMonth()];
      
      if (!months[monthKey]) {
        months[monthKey] = { profit: 0, loss: 0, trades: 0 };
      }
      
      if (trade.profit_loss > 0) {
        months[monthKey].profit += trade.profit_loss;
      } else {
        months[monthKey].loss += trade.profit_loss;
      }
      months[monthKey].trades += 1;
    });

    return monthNames
      .filter(month => months[month])
      .map(month => ({
        month,
        profit: months[month].profit,
        loss: months[month].loss,
        trades: months[month].trades
      }));
  }, [trades]);

  // Recent trades (last 5)
  const recentTrades = trades.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8 w-full">
        <div className="text-center">
          <p className="text-muted-foreground">Loading trades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalPnL >= 0 ? '+' : ''} ${Math.abs(stats.totalPnL).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.winRate}%</div>
            <Progress value={stats.winRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg RR</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1:{stats.avgRR}</div>
            <p className="text-xs text-muted-foreground">
              Risk to Reward Ratio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Trades</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Profit and loss breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#22c55e" />
                  <Bar dataKey="loss" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No trades yet. Add a trade to see performance data.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance Curve</CardTitle>
            <CardDescription>Account balance progression</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No trades yet. Add a trade to see balance curve.
              </div>
            )}
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
          {recentTrades.length > 0 ? (
            <div className="space-y-4 w-full">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${sessionColors[trade.session] || 'bg-gray-500'}`} />
                    <div>
                      <div className="font-medium">{trade.pair}</div>
                      <div className="text-sm text-muted-foreground">{trade.side} • {trade.session} Session</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Entry: {trade.entry_price.toFixed(4)}</div>
                      <div className="text-sm text-muted-foreground">Exit: {trade.exit_price.toFixed(4)}</div>
                    </div>
                    
                    <Badge variant={trade.profit_loss >= 0 ? 'default' : 'destructive'} 
                           className={trade.profit_loss >= 0 ? 'bg-green-600' : 'bg-red-600'}>
                      {trade.profit_loss >= 0 ? '+' : ''} ${Math.abs(trade.profit_loss).toFixed(2)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trades yet. Start by adding your first trade!</p>
              <Button onClick={handleAddTrade} className="mt-4">
                Add Your First Trade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
