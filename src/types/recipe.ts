
export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  preparation: string[];
  image?: string;
}
