import React, { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { TradeEntry } from "./components/TradeEntry";
import { Analytics } from "./components/Analytics";
import { Login } from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Settings,
  BookOpen,
  Camera,
  FileText,
  TrendingUp,
  Brain,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { useTrades } from "./lib/hooks/useTrades";
import { useNotes } from "./lib/hooks/useNotes";
import { useScreenshots } from "./lib/hooks/useScreenshots";
import { useSettings } from "./lib/hooks/useSettings";
import { Switch } from "./components/ui/switch";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import "@/styles/globals.css";

function AppContent() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} />;
      case "new-trade":
        return <TradeEntry />;
      case "analytics":
      case "performance":
      case "risk":
      case "psychology":
        return <Analytics />;
      case "journal":
      case "all-trades":
        return <TradesJournal />;
      case "screenshots":
        return <ScreenshotsGallery />;
      case "notes":
        return <NotesAnalysis />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 overflow-y-auto w-full">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Real data components
function TradesJournal() {
  const { user } = useAuth();
  const { trades, isLoading, deleteTrade } = useTrades(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-muted-foreground">Loading trades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Trade Journal
        </h1>
        <p className="text-muted-foreground">
          Complete history of your trading journey
        </p>
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
          {trades.length > 0 ? (
            <div className="space-y-4">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      {trade.date}
                    </div>
                    <div>
                      <div className="font-medium">{trade.pair}</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.side} • {trade.session}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="outline"
                      className="text-purple-600 border-purple-600"
                    >
                      R:R 1:{trade.rr_ratio.toFixed(2)}
                    </Badge>
                    <Badge
                      variant={
                        trade.profit_loss > 0 ? "default" : "destructive"
                      }
                      className={
                        trade.profit_loss > 0 ? "bg-green-600" : "bg-red-600"
                      }
                    >
                      {trade.profit_loss > 0 ? "+" : ""} ${Math.abs(
                        trade.profit_loss
                      ).toFixed(2)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTrade(trade.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trades yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ScreenshotsGallery() {
  const { user } = useAuth();
  const { screenshots, isLoading, deleteScreenshot } = useScreenshots(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-muted-foreground">Loading screenshots...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Screenshots Gallery
        </h1>
        <p className="text-muted-foreground">
          Visual documentation of your trades
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Chart Screenshots
          </CardTitle>
          <CardDescription>
            Organized collection of your trade screenshots
          </CardDescription>
        </CardHeader>
        <CardContent>
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="relative group">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {screenshot.url && (
                      <img
                        src={screenshot.url}
                        alt={screenshot.description || "Trade screenshot"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteScreenshot(screenshot.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No screenshots yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NotesAnalysis() {
  const { user } = useAuth();
  const { notes, isLoading, deleteNote, addNote } = useNotes(user?.id);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      return;
    }

    try {
      await addNote({
        user_id: user!.id,
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Notes & Analysis
        </h1>
        <p className="text-muted-foreground">
          Insights and observations from your trading
        </p>
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
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{note.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No notes yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your analysis..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-32"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAddNote}
              disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
            >
              Add Note
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings } = useSettings(user?.id);

  const handleSettingChange = async (key: string, value: boolean) => {
    if (!settings) return;
    try {
      await updateSettings({
        ...settings,
        [key]: value,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Customize your trading journal experience
        </p>
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Win Rate</span>
                <Switch
                  checked={settings.show_win_rate}
                  onCheckedChange={(value) =>
                    handleSettingChange("show_win_rate", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Risk:Reward</span>
                <Switch
                  checked={settings.show_risk_reward}
                  onCheckedChange={(value) =>
                    handleSettingChange("show_risk_reward", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Balance Curve</span>
                <Switch
                  checked={settings.show_balance_curve}
                  onCheckedChange={(value) =>
                    handleSettingChange("show_balance_curve", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Emotional Analysis</span>
                <Switch
                  checked={settings.show_emotional_analysis}
                  onCheckedChange={(value) =>
                    handleSettingChange("show_emotional_analysis", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Performance Metrics</span>
                <Switch
                  checked={settings.show_performance_metrics}
                  onCheckedChange={(value) =>
                    handleSettingChange("show_performance_metrics", value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="text-sm text-muted-foreground mt-1">
                {user?.email}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Account Status</label>
              <Badge className="mt-2 bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
