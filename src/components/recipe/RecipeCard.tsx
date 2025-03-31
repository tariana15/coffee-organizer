
import { Coffee, CupSoda, Cherry, Croissant } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Recipe } from "@/types/recipe";
import { getCategoryIcon } from "@/utils/recipeUtils";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const renderIcon = () => {
    const iconType = getCategoryIcon(recipe.category);
    switch (iconType) {
      case 'coffee':
        return <Coffee className="h-5 w-5" />;
      case 'cup-soda':
        return <CupSoda className="h-5 w-5" />;
      case 'croissant':
        return <Croissant className="h-5 w-5" />;
      case 'cherry':
      default:
        return <Cherry className="h-5 w-5" />;
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
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
              {renderIcon()}
              <h3 className="font-medium">{recipe.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.ingredients.slice(0, 2).join(', ')}
              {recipe.ingredients.length > 2 && '...'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
