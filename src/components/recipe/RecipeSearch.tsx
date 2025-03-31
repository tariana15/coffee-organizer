
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RecipeSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RecipeSearch = ({ searchQuery, onSearchChange }: RecipeSearchProps) => {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Поиск рецепта..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default RecipeSearch;
