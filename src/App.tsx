import React, { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TradeEntry } from './components/TradeEntry';
import { Analytics } from './components/Analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Settings, BookOpen, Camera, FileText, TrendingUp, Brain } from 'lucide-react';
import './styles/globals.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'new-trade':
        return <TradeEntry />;
      case 'analytics':
      case 'performance':
      case 'risk':
      case 'psychology':
        return <Analytics />;
      case 'journal':
      case 'all-trades':
        return <TradesJournal />;
      case 'screenshots':
        return <ScreenshotsGallery />;
      case 'notes':
        return <NotesAnalysis />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}

// Placeholder components for other sections
function TradesJournal() {
  const mockTrades = [
    { id: 1, date: '2024-01-15', pair: 'EUR/USD', side: 'Long', pnl: '+$330', session: 'London', rr: '1:2.1' },
    { id: 2, date: '2024-01-14', pair: 'GBP/JPY', side: 'Short', pnl: '+$560', session: 'Asian', rr: '1:1.8' },
    { id: 3, date: '2024-01-13', pair: 'USD/CAD', side: 'Long', pnl: '-$175', session: 'NY', rr: '1:0.8' },
    { id: 4, date: '2024-01-12', pair: 'AUD/USD', side: 'Short', pnl: '-$115', session: 'Asian', rr: '1:0.6' },
    { id: 5, date: '2024-01-11', pair: 'EUR/GBP', side: 'Long', pnl: '+$310', session: 'London', rr: '1:2.5' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Trade Journal
        </h1>
        <p className="text-muted-foreground">Complete history of your trading journey</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            All Trades
          </CardTitle>
          <CardDescription>Detailed view of all your trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">{trade.date}</div>
                  <div>
                    <div className="font-medium">{trade.pair}</div>
                    <div className="text-sm text-muted-foreground">{trade.side} • {trade.session}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    R:R {trade.rr}
                  </Badge>
                  <Badge variant={trade.pnl.startsWith('+') ? 'default' : 'destructive'} 
                         className={trade.pnl.startsWith('+') ? 'bg-green-600' : 'bg-red-600'}>
                    {trade.pnl}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScreenshotsGallery() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Screenshots Gallery
        </h1>
        <p className="text-muted-foreground">Visual documentation of your trades</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Chart Screenshots
          </CardTitle>
          <CardDescription>Organized collection of your trade screenshots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotesAnalysis() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Notes & Analysis
        </h1>
        <p className="text-muted-foreground">Insights and observations from your trading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">EUR/USD - Jan 15, 2024</div>
              <p className="text-sm">Perfect ICT setup with clear order block rejection. Market showed beautiful liquidity sweep before reversing. Confidence was high due to multiple confluences aligning.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">GBP/JPY - Jan 14, 2024</div>
              <p className="text-sm">Asian session scalp worked perfectly. Market intuition was strong about the reversal point. Need to trust these insights more consistently.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Pattern Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Order Block Setups</span>
                <Badge className="bg-green-600">87% Success</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Liquidity Sweeps</span>
                <Badge className="bg-blue-600">73% Success</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fair Value Gaps</span>
                <Badge className="bg-orange-600">65% Success</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">Customize your trading journal experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Analytics Preferences
            </CardTitle>
            <CardDescription>Choose which metrics to display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Show Win Rate', enabled: true, color: 'green' },
                { label: 'Show Risk:Reward', enabled: true, color: 'blue' },
                { label: 'Show Balance Curve', enabled: true, color: 'purple' },
                { label: 'Show Emotional Analysis', enabled: true, color: 'orange' },
                { label: 'Show Performance Metrics', enabled: true, color: 'red' }
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <span className="text-sm">{setting.label}</span>
                  <div className={`w-4 h-4 rounded-full bg-${setting.color}-500`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Broker Integration</CardTitle>
            <CardDescription>Connect your MT4/MT5 accounts (Demo Only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
              <p className="text-muted-foreground">Broker integration disabled in demo</p>
              <p className="text-sm text-muted-foreground mt-1">This feature would sync trades automatically</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}