
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Search, Plus, Filter, Package, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface InventoryItem {
  id: string;
  name: string;
  category: 
    | "coffee" 
    | "milk" 
    | "syrup" 
    | "tea" 
    | "dessert" 
    | "other";
  unit: string;
  inStock: number;
  minThreshold: number;
  price: number;
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: "i1",
    name: "Зерно Бразилия",
    category: "coffee",
    unit: "кг",
    inStock: 5.2,
    minThreshold: 2,
    price: 1200,
  },
  {
    id: "i2",
    name: "Зерно Эфиопия",
    category: "coffee",
    unit: "кг",
    inStock: 1.8,
    minThreshold: 2,
    price: 1500,
  },
  {
    id: "i3",
    name: "Молоко 3.2%",
    category: "milk",
    unit: "л",
    inStock: 8.5,
    minThreshold: 5,
    price: 120,
  },
  {
    id: "i4",
    name: "Молоко растительное",
    category: "milk",
    unit: "л",
    inStock: 3.2,
    minThreshold: 2,
    price: 280,
  },
  {
    id: "i5",
    name: "Сироп Ваниль",
    category: "syrup",
    unit: "л",
    inStock: 0.9,
    minThreshold: 1,
    price: 450,
  },
  {
    id: "i6",
    name: "Сироп Карамель",
    category: "syrup",
    unit: "л",
    inStock: 1.2,
    minThreshold: 1,
    price: 450,
  },
  {
    id: "i7",
    name: "Чай Эрл Грей",
    category: "tea",
    unit: "уп",
    inStock: 4,
    minThreshold: 2,
    price: 320,
  },
  {
    id: "i8",
    name: "Черничный маффин",
    category: "dessert",
    unit: "шт",
    inStock: 12,
    minThreshold: 5,
    price: 120,
  },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter items based on search and category
  const filteredItems = mockInventory.filter(item => 
    (activeTab === "all" || item.category === activeTab) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort to show low stock items first
  const sortedItems = [...filteredItems].sort((a, b) => {
    // First sort by low stock (below threshold)
    const aLowStock = a.inStock < a.minThreshold;
    const bLowStock = b.inStock < b.minThreshold;
    
    if (aLowStock && !bLowStock) return -1;
    if (!aLowStock && bLowStock) return 1;
    
    // Then sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  // Count low stock items
  const lowStockCount = mockInventory.filter(
    item => item.inStock < item.minThreshold
  ).length;

  return (
    <AppLayout title="Учёт товаров">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск товара..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          {lowStockCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              Мало запасов: {lowStockCount}
            </Badge>
          )}
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="coffee">Кофе</TabsTrigger>
          <TabsTrigger value="milk">Молоко</TabsTrigger>
          <TabsTrigger value="syrup">Сиропы</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3">
          {sortedItems.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Товары не найдены</p>
            </div>
          ) : (
            sortedItems.map(item => {
              const isLowStock = item.inStock < item.minThreshold;
              
              return (
                <Card 
                  key={item.id}
                  className={`p-4 ${isLowStock ? 'border-destructive/50 bg-destructive/5' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {isLowStock && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()} ₽ / {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                          {item.inStock} {item.unit}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {isLowStock ? (
                        <p className="text-xs text-destructive">
                          Мин. {item.minThreshold} {item.unit}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Мин. {item.minThreshold} {item.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Inventory;
