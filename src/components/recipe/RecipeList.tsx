
import { Loader2 } from "lucide-react";
import { Recipe } from "@/types/recipe";
import RecipeCard from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  loading: boolean;
  activeTab: string;
  searchQuery: string;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList = ({ 
  recipes, 
  loading, 
  activeTab, 
  searchQuery,
  onSelectRecipe 
}: RecipeListProps) => {
  
  const filteredRecipes = recipes.filter(recipe => 
    (activeTab === "all" || recipe.category === activeTab) &&
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Загрузка рецептов...</p>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Рецепты не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRecipes.map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onClick={() => onSelectRecipe(recipe)} 
        />
      ))}
    </div>
  );
};

export default RecipeList;
