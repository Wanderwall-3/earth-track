import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { WasteLogger } from '@/components/dashboard/WasteLogger';
import { Analytics } from '@/components/dashboard/Analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BarChart3, Plus, BookOpen, Users, Settings } from 'lucide-react';

interface WasteLogEntry {
  id: string;
  date: string;
  category: 'Recyclable' | 'Compostable' | 'Landfill';
  itemName: string;
  quantity: number;
  userId: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<WasteLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState('logger');

  useEffect(() => {
    // Load existing logs from localStorage
    const savedLogs = JSON.parse(localStorage.getItem('wasteManager_logs') || '[]');
    setLogs(savedLogs);
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogAdded = (newLog: WasteLogEntry) => {
    setLogs(prev => [...prev, newLog]);
  };

  const handleLogout = () => {
    logout();
  };

  const recentLogs = logs
    .filter(log => log.userId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ET</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EcoTracker</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.community}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {logs.filter(log => log.userId === user.id).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Items Logged</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">RECENT ACTIVITY</h4>
                  {recentLogs.length > 0 ? (
                    <div className="space-y-2">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="p-2 bg-muted rounded text-xs">
                          <div className="font-medium">{log.itemName}</div>
                          <div className="text-muted-foreground">{log.category} • {log.quantity}x</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="logger" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Log Waste</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="challenges" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Challenges</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Learn</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="logger">
                <WasteLogger onLogAdded={handleLogAdded} userId={user.id} />
              </TabsContent>

              <TabsContent value="analytics">
                <Analytics userId={user.id} logs={logs} />
              </TabsContent>

              <TabsContent value="challenges">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Community Challenges</CardTitle>
                    <CardDescription>Join challenges and compete with your community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-primary/20 rounded-lg bg-gradient-secondary">
                        <h3 className="font-semibold text-primary">Reduce Landfill Waste by 15%</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Challenge your community to reduce landfill waste this week
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-medium">Progress: 68%</span>
                          <Button size="sm" variant="eco">Join Challenge</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg">
                        <h3 className="font-semibold">Composting Week</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Increase compostable waste logging by 25%
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-medium">Progress: 42%</span>
                          <Button size="sm" variant="outline">Join Challenge</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Educational Resources</CardTitle>
                    <CardDescription>Learn best practices for waste reduction and sustainability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-success">Composting 101</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Learn how to start composting at home and reduce organic waste.
                        </p>
                        <Button size="sm" variant="ghost" className="mt-3 p-0 h-auto text-primary">
                          Read More →
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-info">Recycling Guidelines</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Understand what can and cannot be recycled in your area.
                        </p>
                        <Button size="sm" variant="ghost" className="mt-3 p-0 h-auto text-primary">
                          Read More →
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-warning">Waste Reduction Tips</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Simple strategies to reduce waste in your daily life.
                        </p>
                        <Button size="sm" variant="ghost" className="mt-3 p-0 h-auto text-primary">
                          Read More →
                        </Button>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-primary">Local Services</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Find recycling centers and waste collection schedules near you.
                        </p>
                        <Button size="sm" variant="ghost" className="mt-3 p-0 h-auto text-primary">
                          Find Services →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;