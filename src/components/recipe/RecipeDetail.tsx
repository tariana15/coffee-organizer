
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Coffee, CupSoda, Cherry, Croissant } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { getCategoryIcon } from "@/utils/recipeUtils";

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail = ({ recipe, onClose }: RecipeDetailProps) => {
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
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-background rounded-t-xl sm:rounded-xl border shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {recipe.image && (
          <div className="h-48 w-full bg-muted">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            {renderIcon()}
            <h2 className="text-xl font-semibold">{recipe.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{recipe.category}</p>
          
          <h3 className="font-medium mb-2">Ингредиенты:</h3>
          <div className="space-y-1 mb-4">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm text-muted-foreground">• {ingredient}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Ингредиенты не указаны</div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="font-medium mb-2">Приготовление:</h3>
          <ol className="space-y-2 list-decimal list-inside mb-6">
            {recipe.preparation && recipe.preparation.length > 0 ? (
              recipe.preparation.map((step, index) => (
                <li key={index} className="text-muted-foreground">
                  <span className="text-foreground">{index + 1}.</span> {step}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Шаги приготовления не указаны</li>
            )}
          </ol>
          
          <Button 
            className="w-full py-3" 
            onClick={onClose}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
