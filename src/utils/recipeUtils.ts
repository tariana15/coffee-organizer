
import { Recipe } from "@/types/recipe";

export const mockRecipes: Recipe[] = [
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

export const fetchGoogleSheetRecipes = async (): Promise<Recipe[]> => {
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
  const validCategories = new Set(["классические", "авторские", "чай", "сезонные", "горячие", "холодные", "десерты", "другое"]);
  
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
      // Get category directly from the first column
      let category = row[0]?.trim() || 'другое';
      
      // Clean up category and normalize
      if (category.includes(',') || category.includes('\n')) {
        // Take only the first part before comma or newline
        category = category.split(/[,\n]/)[0].trim().toLowerCase();
      } else {
        category = category.toLowerCase();
      }
      
      // Map categories to valid ones
      if (!validCategories.has(category)) {
        // Check for partial matches
        if (category.includes('классич') || category.includes('класс')) {
          category = 'классические';
        } else if (category.includes('автор')) {
          category = 'авторские';
        } else if (category.includes('чай')) {
          category = 'чай';
        } else if (category.includes('сезон')) {
          category = 'сезонные';
        } else if (category.includes('горяч')) {
          category = 'горячие';
        } else if (category.includes('холод')) {
          category = 'холодные';
        } else if (category.includes('десерт')) {
          category = 'десерты';
        } else {
          category = 'другое';
        }
      }
      
      // Parse ingredients - split by newlines or semicolons
      const ingredients = row[2]?.trim() 
        ? row[2].replace(/\n/g, ';').split(';').map(item => item.trim()).filter(Boolean)
        : [];
      
      // Parse preparation steps - split by newlines or semicolons
      const preparation = row[3]?.trim() 
        ? row[3].replace(/\n/g, ';').split(';').map(s => s.trim()).filter(Boolean)
        : [];
      
      // Safely handle image URL - make sure not to add invalid URLs
      let imageUrl = undefined;
      if (row[4]?.trim()) {
        try {
          const url = row[4].trim();
          // Simple validation to prevent malformed URIs
          if (url.startsWith('http://') || url.startsWith('https://')) {
            imageUrl = url;
          }
        } catch (e) {
          console.warn("Invalid image URL for recipe:", row[1]);
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
  
  return fetchedRecipes;
};

export const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('кофе') || lowerCategory.includes('классич') || lowerCategory.includes('автор')) {
    return 'coffee';
  } else if (lowerCategory.includes('чай')) {
    return 'cup-soda';
  } else if (lowerCategory.includes('десс') || lowerCategory.includes('выпеч')) {
    return 'croissant';
  } else {
    return 'cherry';
  }
};
