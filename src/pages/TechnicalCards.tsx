import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  Search, 
  Coffee,
  CupSoda,
  Cherry,
  Croissant
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface RecipeIngredient {
  name: string;
  amount: string;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  preparation: string[];
  image?: string;
}

const TechnicalCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Google Sheets ID from the URL
        const spreadsheetId = "1nWyXFaS1G5LZ--C0nHxSy5lzU-9wa06DWoE7ucHRlj8";
        // Sheet ID from the URL
        const sheetId = "0";
        // Use Google Sheets API to fetch data in CSV format
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheets");
        }
        
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(",").map(cell => cell.trim()));
        
        // Skip header row (if present)
        const dataRows = rows.slice(1);
        
        // Map the data to our Recipe interface
        const fetchedRecipes: Recipe[] = dataRows.map((row, index) => {
          // Ensure we have enough columns
          if (row.length >= 4) {
            return {
              id: `r${index + 1}`,
              category: row[0] || "other", // First column for category
              name: row[1] || "Неизвестное название", // Second column for name
              ingredients: [row[2] || ""], // Third column for ingredients
              preparation: [row[3] || ""], // Fourth column for preparation
              description: row[2] || "" // Using ingredients as description too
            };
          }
          return null;
        }).filter(Boolean) as Recipe[];
        
        // Extract unique categories
        const uniqueCategories = ["all", ...new Set(fetchedRecipes.map(recipe => recipe.category))];
        console.info("Unique categories:", uniqueCategories);
        console.info("Fetched recipes:", fetchedRecipes);
        
        setRecipes(fetchedRecipes);
        setCategories(uniqueCategories);
        setActiveTab("all"); // Reset to "all" tab
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить рецепты из Google Sheets",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    (activeTab === "all" || recipe.category === activeTab) &&
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
      case "классические":
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

      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Загрузка рецептов...</p>
        </div>
      ) : (
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-4 mb-4 overflow-x-auto">
            {categories.slice(0, 4).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category === "all" ? "Все" : category}
              </TabsTrigger>
            ))}
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
      )}

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
