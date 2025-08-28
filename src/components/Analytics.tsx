import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Heart, Target, Zap } from 'lucide-react';

const emotionData = [
  { name: 'Confident', value: 35, color: 'var(--chakra-heart)' },
  { name: 'Focused', value: 25, color: 'var(--chakra-third-eye)' },
  { name: 'Calm', value: 20, color: 'var(--chakra-throat)' },
  { name: 'Rushed', value: 12, color: 'var(--chakra-sacral)' },
  { name: 'Uncertain', value: 8, color: 'var(--chakra-solar)' }
];

const sessionData = [
  { session: 'Asian', winRate: 72, trades: 45, profit: 1200 },
  { session: 'London', winRate: 68, trades: 89, profit: 2100 },
  { session: 'NY', winRate: 61, trades: 67, profit: 1650 }
];

const riskRewardData = [
  { range: '0-0.5', count: 8 },
  { range: '0.5-1', count: 15 },
  { range: '1-1.5', count: 32 },
  { range: '1.5-2', count: 45 },
  { range: '2-3', count: 28 },
  { range: '3+', count: 12 }
];

const mistakeData = [
  { mistake: 'Early Exit', count: 23, impact: -850 },
  { mistake: 'No Stop Loss', count: 8, impact: -1200 },
  { mistake: 'Overleveraged', count: 12, impact: -950 },
  { mistake: 'FOMO Entry', count: 18, impact: -680 },
  { mistake: 'Revenge Trading', count: 6, impact: -1400 }
];

const chakraAlignment = [
  { chakra: 'Root', alignment: 85, description: 'Grounding & Stability' },
  { chakra: 'Sacral', alignment: 72, description: 'Creativity & Flow' },
  { chakra: 'Solar', alignment: 91, description: 'Confidence & Power' },
  { chakra: 'Heart', alignment: 88, description: 'Balance & Compassion' },
  { chakra: 'Throat', alignment: 76, description: 'Expression & Truth' },
  { chakra: 'Third Eye', alignment: 94, description: 'Intuition & Insight' },
  { chakra: 'Crown', alignment: 82, description: 'Connection & Wisdom' }
];

export function Analytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Trading Analytics
        </h1>
        <p className="text-muted-foreground">Deep insights into your trading performance and psychology</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="psychology" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Psychology
          </TabsTrigger>
          <TabsTrigger value="chakra" className="data-[state=active]:bg-chakra-crown data-[state=active]:text-white">
            Chakra Alignment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Session Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Session Performance Analysis</CardTitle>
              <CardDescription>Performance breakdown by trading sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessionData.map((session) => (
                  <div key={session.session} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {session.session} Session
                      </h3>
                      <Badge className="bg-blue-600 text-white">
                        {session.trades} trades
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Win Rate</span>
                        <span>{session.winRate}%</span>
                      </div>
                      <Progress value={session.winRate} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profit</span>
                      <span className="font-medium text-green-600">+${session.profit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Reward Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk:Reward Distribution</CardTitle>
                <CardDescription>Distribution of your R:R ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskRewardData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Common Mistakes</CardTitle>
                <CardDescription>Most frequent trading errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mistakeData.map((mistake, index) => (
                    <div key={mistake.mistake} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-sm">{mistake.mistake}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-600">{mistake.impact}</div>
                        <div className="text-xs text-muted-foreground">{mistake.count} times</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="psychology" className="space-y-6">
          {/* Emotional State Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-chakra-heart">Emotional State Distribution</CardTitle>
                <CardDescription>Your emotional patterns while trading</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-chakra-third-eye">Emotional Impact Analysis</CardTitle>
                <CardDescription>How emotions affect your trading results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-chakra-heart/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-chakra-heart" />
                      <span className="text-sm">Confident Trades</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-chakra-heart">+$2,150</div>
                      <div className="text-xs text-muted-foreground">78% Win Rate</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-chakra-third-eye/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-chakra-third-eye" />
                      <span className="text-sm">Focused Trades</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-chakra-third-eye">+$1,820</div>
                      <div className="text-xs text-muted-foreground">72% Win Rate</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-chakra-root/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-chakra-root" />
                      <span className="text-sm">Rushed Trades</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-chakra-root">-$680</div>
                      <div className="text-xs text-muted-foreground">45% Win Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Confidence Level Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-chakra-solar">Confidence vs Performance</CardTitle>
              <CardDescription>Correlation between confidence levels and trade outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { level: "1-2", winRate: 35, color: "chakra-root" },
                  { level: "3-4", winRate: 48, color: "chakra-sacral" },
                  { level: "5-6", winRate: 62, color: "chakra-solar" },
                  { level: "7-8", winRate: 74, color: "chakra-heart" },
                  { level: "9-10", winRate: 81, color: "chakra-crown" }
                ].map((conf) => (
                  <div key={conf.level} className="text-center space-y-2">
                    <div className={`text-sm font-medium text-${conf.color}`}>
                      Confidence {conf.level}
                    </div>
                    <div className="relative">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-${conf.color}/20 flex items-center justify-center`}>
                        <span className={`text-lg font-bold text-${conf.color}`}>
                          {conf.winRate}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chakra" className="space-y-6">
          {/* Chakra Alignment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-chakra-crown">Chakra Alignment Status</CardTitle>
              <CardDescription>Your energetic balance and trading consciousness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chakraAlignment.map((chakra, index) => (
                  <div key={chakra.chakra} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-chakra-${['root', 'sacral', 'solar', 'heart', 'throat', 'third-eye', 'crown'][index]}`}></div>
                      <div>
                        <h3 className="font-medium">{chakra.chakra} Chakra</h3>
                        <p className="text-xs text-muted-foreground">{chakra.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Alignment</span>
                        <span>{chakra.alignment}%</span>
                      </div>
                      <Progress value={chakra.alignment} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chakra Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-chakra-third-eye">
              <CardHeader>
                <CardTitle className="text-chakra-third-eye">Intuition Enhancement</CardTitle>
                <CardDescription>Third Eye Chakra - Highest Alignment (94%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Your intuitive abilities are highly developed. Continue to:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Trust your market analysis instincts</li>
                  <li>• Meditate before trading sessions</li>
                  <li>• Pay attention to subtle market patterns</li>
                  <li>• Document intuitive insights in your journal</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chakra-sacral">
              <CardHeader>
                <CardTitle className="text-chakra-sacral">Flow State Development</CardTitle>
                <CardDescription>Sacral Chakra - Needs Attention (72%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Enhance your creative flow and adaptability:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Practice flexible trade management</li>
                  <li>• Embrace market volatility as opportunity</li>
                  <li>• Engage in creative visualization exercises</li>
                  <li>• Balance structured analysis with intuitive flow</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}