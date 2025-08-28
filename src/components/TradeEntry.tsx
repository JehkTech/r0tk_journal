import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Upload, Save, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export function TradeEntry() {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    pair: '',
    side: '',
    lotSize: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    session: '',
    strategy: '',
    emotion: '',
    confidence: 5,
    notes: '',
    screenshots: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trade submitted:', formData);
    // Reset form
    setFormData({
      pair: '',
      side: '',
      lotSize: '',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      takeProfit: '',
      session: '',
      strategy: '',
      emotion: '',
      confidence: 5,
      notes: '',
      screenshots: []
    });
    setDate(undefined);
  };

  const calculateRR = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit);
    
    if (entry && sl && tp && formData.side) {
      const risk = formData.side === 'Long' ? Math.abs(entry - sl) : Math.abs(sl - entry);
      const reward = formData.side === 'Long' ? Math.abs(tp - entry) : Math.abs(entry - tp);
      
      if (risk > 0) {
        return (reward / risk).toFixed(2);
      }
    }
    return '0.00';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          New Trade Entry
        </h1>
        <p className="text-muted-foreground">Document your trade with complete details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Details */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-600">Trade Details</CardTitle>
              <CardDescription>Basic trade information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pair">Currency Pair</Label>
                  <Select value={formData.pair} onValueChange={(value) => setFormData({...formData, pair: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EURUSD">EUR/USD</SelectItem>
                      <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                      <SelectItem value="USDJPY">USD/JPY</SelectItem>
                      <SelectItem value="GBPJPY">GBP/JPY</SelectItem>
                      <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                      <SelectItem value="USDCAD">USD/CAD</SelectItem>
                      <SelectItem value="EURGBP">EUR/GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="side">Direction</Label>
                  <Select value={formData.side} onValueChange={(value) => setFormData({...formData, side: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Long">Long (Buy)</SelectItem>
                      <SelectItem value="Short">Short (Sell)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Trade Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  placeholder="0.10"
                  value={formData.lotSize}
                  onChange={(e) => setFormData({...formData, lotSize: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Levels */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">Price Levels</CardTitle>
              <CardDescription>Entry, exit, and risk management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    placeholder="1.0945"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    placeholder="1.0978"
                    value={formData.exitPrice}
                    onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    placeholder="1.0920"
                    value={formData.stopLoss}
                    onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    placeholder="1.0990"
                    value={formData.takeProfit}
                    onChange={(e) => setFormData({...formData, takeProfit: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk:Reward Ratio</span>
                  <Badge className="bg-purple-600 text-white">
                    1:{calculateRR()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context & Psychology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-600">Trading Context</CardTitle>
              <CardDescription>Session and strategy details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session">Trading Session</Label>
                <Select value={formData.session} onValueChange={(value) => setFormData({...formData, session: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asian">Asian Session</SelectItem>
                    <SelectItem value="London">London Session</SelectItem>
                    <SelectItem value="NY">New York Session</SelectItem>
                    <SelectItem value="Overlap">Session Overlap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Strategy Used</Label>
                <Select value={formData.strategy} onValueChange={(value) => setFormData({...formData, strategy: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ICT">ICT Concepts</SelectItem>
                    <SelectItem value="Scalping">Scalping</SelectItem>
                    <SelectItem value="Swing">Swing Trading</SelectItem>
                    <SelectItem value="Breakout">Breakout</SelectItem>
                    <SelectItem value="SMC">Smart Money Concepts</SelectItem>
                    <SelectItem value="OrderBlocks">Order Blocks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-600">Psychology & Notes</CardTitle>
              <CardDescription>Emotional state and observations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emotion">Emotional State</Label>
                <Select value={formData.emotion} onValueChange={(value) => setFormData({...formData, emotion: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How did you feel?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confident">Confident</SelectItem>
                    <SelectItem value="Focused">Focused</SelectItem>
                    <SelectItem value="Calm">Calm</SelectItem>
                    <SelectItem value="Rushed">Rushed</SelectItem>
                    <SelectItem value="Uncertain">Uncertain</SelectItem>
                    <SelectItem value="Fearful">Fearful</SelectItem>
                    <SelectItem value="Greedy">Greedy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">Confidence Level: {formData.confidence}/10</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.confidence}
                  onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--chakra-root) 0%, var(--chakra-solar) 50%, var(--chakra-heart) 100%)`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes and Screenshots */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-600">Additional Information</CardTitle>
            <CardDescription>Notes, screenshots, and analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Trade Notes</Label>
              <Textarea
                id="notes"
                placeholder="What was your analysis? What did you observe? Any mistakes or lessons learned?"
                className="min-h-32"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshots</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
                <p className="text-muted-foreground">Upload chart screenshots</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => {
            setFormData({
              pair: '',
              side: '',
              lotSize: '',
              entryPrice: '',
              exitPrice: '',
              stopLoss: '',
              takeProfit: '',
              session: '',
              strategy: '',
              emotion: '',
              confidence: 5,
              notes: '',
              screenshots: []
            });
            setDate(undefined);
          }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
          
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Trade
          </Button>
        </div>
      </form>
    </div>
  );
}