
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface CategoryTabsProps {
  categories: string[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

const CategoryTabs = ({ 
  categories, 
  activeTab, 
  onTabChange, 
  children 
}: CategoryTabsProps) => {
  return (
    <Tabs 
      defaultValue="all" 
      value={activeTab}
      onValueChange={onTabChange}
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
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
