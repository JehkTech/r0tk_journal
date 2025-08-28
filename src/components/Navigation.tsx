import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  BookOpen, 
  Target, 
  TrendingUp,
  FileText,
  Camera,
  Brain,
  Zap,
  Activity,
  Heart,
  Lightbulb
} from 'lucide-react';
import { Badge } from './ui/badge';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      id: "dashboard"
    },
    {
      title: "New Trade",
      icon: Calendar,
      id: "new-trade"
    },
    {
      title: "Trade Journal",
      icon: BookOpen,
      id: "journal",
      submenu: [
        { title: "All Trades", id: "all-trades" },
        { title: "Screenshots", id: "screenshots" },
        { title: "Notes & Analysis", id: "notes" }
      ]
    },
    {
      title: "Analytics",
      icon: Target,
      id: "analytics",
      submenu: [
        { title: "Performance", id: "performance" },
        { title: "Risk Analysis", id: "risk" },
        { title: "Psychology", id: "psychology" }
      ]
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings"
    }
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">R0TK Journal</h2>
            <p className="text-sm text-muted-foreground">Trading Insights</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className={`group ${activeSection === item.id ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  
                  {item.submenu && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            onClick={() => onSectionChange(subItem.id)}
                            isActive={activeSection === subItem.id}
                          >
                            {subItem.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Trading Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Account Status</span>
                <Badge variant="outline" className="ml-auto text-xs">Active</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Risk Level</span>
                <Badge variant="outline" className="ml-auto text-xs">Low</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Performance</span>
                <Badge variant="outline" className="ml-auto text-xs">Good</Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Professional trading through
          </p>
          <p className="text-sm font-medium">
            R0TK Analytics
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}