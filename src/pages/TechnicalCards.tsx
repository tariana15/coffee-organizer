
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  Search, 
  Coffee,
  CupSoda,
  Cherry,
  Croissant,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface RecipeIngredient {
  name: string;
  amount: string;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  preparation: string[];
  image?: string;
}

const mockRecipes: Recipe[] = [
  {
    id: "r1",
    name: "Капучино",
    category: "классические",
    ingredients: ["Эспрессо", "Молоко"],
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
    category: "классические",
    ingredients: ["Эспрессо", "Молоко", "Сироп (опционально)"],
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
    category: "классические",
    ingredients: ["Эспрессо", "Горячая вода"],
    preparation: [
      "Приготовить эспрессо (30 мл)",
      "Добавить горячую воду (90-150 мл в зависимости от желаемой крепости)"
    ],
  },
  {
    id: "r4",
    name: "Чай Эрл Грей",
    category: "чай",
    ingredients: ["Чай Эрл Грей", "Горячая вода"],
    preparation: [
      "Нагреть воду до 90-95°C",
      "Заварить чай 3-5 минут"
    ],
  },
  {
    id: "r5",
    name: "Раф кофе",
    category: "авторские",
    ingredients: ["Эспрессо", "Сливки", "Ванильный сахар"],
    preparation: [
      "Приготовить эспрессо (30 мл)",
      "Взбить сливки с ванильным сахаром",
      "Смешать с эспрессо"
    ],
  },
];

const TechnicalCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      try {
        setLoading(true);
        const spreadsheetId = "1nWyXFaS1G5LZ--C0nHxSy5lzU-9wa06DWoE7ucHRlj8";
        const sheetId = "0";
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Skip header row
        const fetchedRecipes: Recipe[] = [];
        const uniqueCategories = new Set<string>();
        uniqueCategories.add("all"); // Always add "all" category
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          // Handle commas within quoted strings
          let row: string[] = [];
          let inQuotes = false;
          let currentValue = '';
          
          for (let char of lines[i]) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              row.push(currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          row.push(currentValue); // Add the last value
          
          if (row.length >= 4 && row[1]?.trim()) {
            const category = row[0]?.trim() || 'другое';
            uniqueCategories.add(category);
            
            // Parse ingredients
            const ingredients = row[2]?.trim() 
              ? row[2].split(';').map(item => item.trim()).filter(Boolean)
              : [];
            
            // Parse preparation steps
            const preparation = row[3]?.trim() 
              ? row[3].split(';').map(s => s.trim()).filter(Boolean)
              : [];
            
            // Safely handle image URL
            let imageUrl = undefined;
            if (row[4]?.trim()) {
              try {
                // Validate the URL or use undefined if invalid
                const url = row[4].trim();
                new URL(url); // This will throw an error if URL is invalid
                imageUrl = url;
              } catch (e) {
                console.warn("Invalid image URL for recipe:", row[1]);
                // Don't set imageUrl if invalid (it stays undefined)
              }
            }
            
            const recipe: Recipe = {
              id: `r${i}`,
              category: category,
              name: row[1]?.trim() || '',
              ingredients: ingredients,
              preparation: preparation,
              image: imageUrl
            };
            
            fetchedRecipes.push(recipe);
          }
        }
        
        console.log("Fetched recipes:", fetchedRecipes);
        console.log("Unique categories:", [...uniqueCategories]);
        
        setCategories([...uniqueCategories]);
        setRecipes(fetchedRecipes.length > 0 ? fetchedRecipes : mockRecipes);
        
        // Set active tab to "all" by default
        setActiveTab("all");
      } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные рецептов",
          variant: "destructive"
        });
        setRecipes(mockRecipes);
        setCategories(["all", ...new Set(mockRecipes.map(r => r.category))]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoogleSheetData();
  }, [toast]);

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('кофе') || lowerCategory.includes('классич') || lowerCategory.includes('автор')) {
      return <Coffee className="h-5 w-5" />;
    } else if (lowerCategory.includes('чай')) {
      return <CupSoda className="h-5 w-5" />;
    } else if (lowerCategory.includes('десс') || lowerCategory.includes('выпеч')) {
      return <Croissant className="h-5 w-5" />;
    } else {
      return <Cherry className="h-5 w-5" />;
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    (activeTab === "all" || recipe.category === activeTab) &&
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, 1fr)` }}>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category === "all" ? "Все" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Загрузка рецептов...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
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
                        {recipe.ingredients.join(', ')}
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
              <p className="text-muted-foreground mb-4">{selectedRecipe.ingredients.join(', ')}</p>
              
              <h3 className="font-medium mb-2">Ингредиенты:</h3>
              <div className="space-y-1 mb-4">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{ingredient}</span>
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
