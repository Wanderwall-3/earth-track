import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Recycle, Leaf, Plus } from 'lucide-react';

interface WasteLogEntry {
  id: string;
  date: string;
  category: 'Recyclable' | 'Compostable' | 'Landfill';
  itemName: string;
  quantity: number;
  userId: string;
}

interface WasteLoggerProps {
  onLogAdded: (entry: WasteLogEntry) => void;
  userId: string;
}

export const WasteLogger: React.FC<WasteLoggerProps> = ({ onLogAdded, userId }) => {
  const [category, setCategory] = useState<'Recyclable' | 'Compostable' | 'Landfill' | ''>('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();

  const categoryIcons = {
    Recyclable: Recycle,
    Compostable: Leaf,
    Landfill: Trash2
  };

  const categoryColors = {
    Recyclable: 'text-info',
    Compostable: 'text-success',
    Landfill: 'text-destructive'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !itemName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: WasteLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: category as 'Recyclable' | 'Compostable' | 'Landfill',
      itemName,
      quantity,
      userId
    };

    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('wasteManager_logs') || '[]');
    existingLogs.push(newEntry);
    localStorage.setItem('wasteManager_logs', JSON.stringify(existingLogs));

    onLogAdded(newEntry);

    // Reset form
    setCategory('');
    setItemName('');
    setQuantity(1);

    toast({
      title: "Waste logged successfully!",
      description: `Added ${quantity} ${itemName} to ${category} category.`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Log Waste Item
        </CardTitle>
        <CardDescription>
          Track your waste to understand your environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Waste Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select waste category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Recyclable">
                  <div className="flex items-center gap-2">
                    <Recycle className="h-4 w-4 text-info" />
                    Recyclable
                  </div>
                </SelectItem>
                <SelectItem value="Compostable">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-success" />
                    Compostable
                  </div>
                </SelectItem>
                <SelectItem value="Landfill">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    Landfill
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              placeholder="e.g., Plastic bottle, Food scraps, Paper"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <Button type="submit" className="w-full" variant="eco">
            Log Waste Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};