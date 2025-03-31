
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "@/types/recipe";
import { fetchGoogleSheetRecipes, mockRecipes } from "@/utils/recipeUtils";
import RecipeSearch from "@/components/recipe/RecipeSearch";
import CategoryTabs from "@/components/recipe/CategoryTabs";
import RecipeList from "@/components/recipe/RecipeList";
import RecipeDetail from "@/components/recipe/RecipeDetail";

const TechnicalCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const { toast } = useToast();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const fetchedRecipes = await fetchGoogleSheetRecipes();
        
        // Extract unique categories
        const uniqueCategories = new Set<string>();
        uniqueCategories.add("all"); // Always add "all" category
        
        fetchedRecipes.forEach(recipe => {
          if (recipe.category) {
            uniqueCategories.add(recipe.category);
          }
        });
        
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

        // Extract categories from mock data as fallback
        const mockCategories = new Set<string>(["all"]);
        mockRecipes.forEach(recipe => mockCategories.add(recipe.category));
        setCategories([...mockCategories]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, [toast]);

  return (
    <AppLayout title="Техкарта" showBackButton>
      <RecipeSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      <CategoryTabs 
        categories={categories} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      >
        <RecipeList 
          recipes={recipes}
          loading={loading}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSelectRecipe={setSelectedRecipe}
        />
      </CategoryTabs>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </AppLayout>
  );
};

export default TechnicalCards;
