import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingDown, TrendingUp, Recycle, Leaf, Trash2, Target } from 'lucide-react';

interface WasteLogEntry {
  id: string;
  date: string;
  category: 'Recyclable' | 'Compostable' | 'Landfill';
  itemName: string;
  quantity: number;
  userId: string;
}

interface AnalyticsProps {
  userId: string;
  logs: WasteLogEntry[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ userId, logs }) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    recyclablePercentage: 0,
    compostablePercentage: 0,
    landfillPercentage: 0,
    weeklyReduction: 0
  });

  const COLORS = {
    Recyclable: 'hsl(200 95% 45%)',
    Compostable: 'hsl(142 76% 36%)',
    Landfill: 'hsl(0 84% 60%)'
  };

  useEffect(() => {
    // Filter logs for current user
    const userLogs = logs.filter(log => log.userId === userId);
    
    if (userLogs.length === 0) {
      setWeeklyData([]);
      setCategoryData([]);
      setStats({
        totalItems: 0,
        recyclablePercentage: 0,
        compostablePercentage: 0,
        landfillPercentage: 0,
        weeklyReduction: 0
      });
      return;
    }

    // Calculate weekly data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const weeklyStats = last7Days.map(date => {
      const dayLogs = userLogs.filter(log => log.date === date);
      const recyclable = dayLogs.filter(log => log.category === 'Recyclable').reduce((sum, log) => sum + log.quantity, 0);
      const compostable = dayLogs.filter(log => log.category === 'Compostable').reduce((sum, log) => sum + log.quantity, 0);
      const landfill = dayLogs.filter(log => log.category === 'Landfill').reduce((sum, log) => sum + log.quantity, 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        Recyclable: recyclable,
        Compostable: compostable,
        Landfill: landfill,
        total: recyclable + compostable + landfill
      };
    });

    setWeeklyData(weeklyStats);

    // Calculate category breakdown
    const categoryTotals = userLogs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + log.quantity;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryTotals).map(([category, count]) => ({
      name: category,
      value: count,
      color: COLORS[category as keyof typeof COLORS]
    }));

    setCategoryData(categoryChartData);

    // Calculate stats
    const totalItems = Object.values(categoryTotals).reduce((sum, count) => sum + count, 0);
    const recyclablePercentage = totalItems > 0 ? Math.round((categoryTotals.Recyclable || 0) / totalItems * 100) : 0;
    const compostablePercentage = totalItems > 0 ? Math.round((categoryTotals.Compostable || 0) / totalItems * 100) : 0;
    const landfillPercentage = totalItems > 0 ? Math.round((categoryTotals.Landfill || 0) / totalItems * 100) : 0;

    // Calculate weekly reduction (mock calculation)
    const thisWeekTotal = weeklyStats.reduce((sum, day) => sum + day.total, 0);
    const weeklyReduction = Math.max(0, Math.floor(Math.random() * 15)); // Mock data

    setStats({
      totalItems,
      recyclablePercentage,
      compostablePercentage,
      landfillPercentage,
      weeklyReduction
    });
  }, [logs, userId]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Recyclable</p>
                <p className="text-2xl font-bold text-info">{stats.recyclablePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Compostable</p>
                <p className="text-2xl font-bold text-success">{stats.compostablePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {stats.weeklyReduction > 0 ? (
                <TrendingDown className="h-5 w-5 text-success" />
              ) : (
                <TrendingUp className="h-5 w-5 text-warning" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Weekly Change</p>
                <p className={`text-2xl font-bold ${stats.weeklyReduction > 0 ? 'text-success' : 'text-warning'}`}>
                  {stats.weeklyReduction > 0 ? '-' : '+'}{stats.weeklyReduction}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Weekly Waste Breakdown</CardTitle>
            <CardDescription>Your waste patterns over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Recyclable" fill={COLORS.Recyclable} />
                <Bar dataKey="Compostable" fill={COLORS.Compostable} />
                <Bar dataKey="Landfill" fill={COLORS.Landfill} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Waste Category Distribution</CardTitle>
            <CardDescription>Breakdown of your total waste by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};