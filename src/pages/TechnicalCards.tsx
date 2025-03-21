
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  Search, 
  Coffee,
  CupSoda,
  Milk,
  Cherry,
  Croissant
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RecipeIngredient {
  name: string;
  amount: string;
}

interface Recipe {
  id: string;
  name: string;
  category: "coffee" | "tea" | "dessert" | "other";
  ingredients: RecipeIngredient[];
  description: string;
  preparation: string[];
  image?: string;
}

const mockRecipes: Recipe[] = [
  {
    id: "r1",
    name: "Капучино",
    category: "coffee",
    ingredients: [
      { name: "Эспрессо", amount: "30 мл" },
      { name: "Молоко", amount: "150 мл" },
    ],
    description: "Классический капучино с нежной молочной пеной.",
    preparation: [
      "Приготовить эспрессо (30 мл)",
      "Взбить молоко до образования микропены",
      "Влить молоко в эспрессо, создавая слоистую структуру",
      "При подаче можно украсить корицей или какао"
    ],
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "r2",
    name: "Латте",
    category: "coffee",
    ingredients: [
      { name: "Эспрессо", amount: "30 мл" },
      { name: "Молоко", amount: "200 мл" },
      { name: "Сироп (опционально)", amount: "15 мл" },
    ],
    description: "Мягкий кофейный напиток с большим количеством молока.",
    preparation: [
      "Приготовить эспрессо (30 мл)",
      "Взбить молоко до образования микропены",
      "Влить молоко в эспрессо, создавая слоистую структуру",
      "При желании добавить сироп"
    ],
  },
  {
    id: "r3",
    name: "Американо",
    category: "coffee",
    ingredients: [
      { name: "Эспрессо", amount: "30 мл" },
      { name: "Горячая вода", amount: "90-150 мл" },
    ],
    description: "Лёгкий кофе, разбавленный горячей водой.",
    preparation: [
      "Приготовить эспрессо (30 мл)",
      "Добавить горячую воду (90-150 мл в зависимости от желаемой крепости)"
    ],
  },
  {
    id: "r4",
    name: "Чай Эрл Грей",
    category: "tea",
    ingredients: [
      { name: "Чай Эрл Грей", amount: "1 пакетик/3 г" },
      { name: "Горячая вода", amount: "200 мл" },
    ],
    description: "Классический черный чай с бергамотом.",
    preparation: [
      "Нагреть воду до 90-95°C",
      "Заварить чай 3-5 минут"
    ],
  },
  {
    id: "r5",
    name: "Черничный маффин",
    category: "dessert",
    ingredients: [
      { name: "Мука", amount: "50 г" },
      { name: "Сахар", amount: "25 г" },
      { name: "Масло", amount: "20 г" },
      { name: "Яйцо", amount: "1/4 шт" },
      { name: "Черника", amount: "15 г" },
      { name: "Разрыхлитель", amount: "1/4 ч.л." },
    ],
    description: "Нежный маффин с черникой.",
    preparation: [
      "Размораживать при комнатной температуре 1 час",
      "Разогреть в микроволновке 20-30 секунд перед подачей"
    ],
  },
];

const TechnicalCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = mockRecipes.filter(recipe => 
    (activeTab === "all" || recipe.category === activeTab) &&
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
        return <Coffee className="h-5 w-5" />;
      case "tea":
        return <CupSoda className="h-5 w-5" />;
      case "dessert":
        return <Croissant className="h-5 w-5" />;
      default:
        return <Cherry className="h-5 w-5" />;
    }
  };

  return (
    <AppLayout title="Техкарта" showBackButton>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск рецепта..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
          <TabsTrigger value="tea">Чай</TabsTrigger>
          <TabsTrigger value="dessert">Десерты</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Рецепты не найдены</p>
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <Card 
                key={recipe.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {recipe.image && (
                      <div className="w-24 h-24 bg-muted flex-shrink-0">
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(recipe.category)}
                        <h3 className="font-medium">{recipe.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-background rounded-t-xl sm:rounded-xl border shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedRecipe.image && (
              <div className="h-48 w-full bg-muted">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(selectedRecipe.category)}
                <h2 className="text-xl font-semibold">{selectedRecipe.name}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{selectedRecipe.description}</p>
              
              <h3 className="font-medium mb-2">Ингредиенты:</h3>
              <div className="space-y-1 mb-4">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{ingredient.name}</span>
                    <span className="text-muted-foreground">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-2">Приготовление:</h3>
              <ol className="space-y-2 list-decimal list-inside mb-6">
                {selectedRecipe.preparation.map((step, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="text-foreground">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
              
              <button
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                onClick={() => setSelectedRecipe(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default TechnicalCards;
