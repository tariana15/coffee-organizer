
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  Coffee, 
  CupSoda, 
  Search, 
  ShoppingBag, 
  Plus,
  Minus,
  Receipt,
  Check,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "sonner";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: "coffee" | "tea" | "dessert" | "other";
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Mock products
const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Капучино",
    price: 220,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "p2",
    name: "Латте",
    price: 250,
    category: "coffee",
  },
  {
    id: "p3",
    name: "Американо",
    price: 180,
    category: "coffee",
  },
  {
    id: "p4",
    name: "Раф",
    price: 270,
    category: "coffee",
  },
  {
    id: "p5",
    name: "Флэт Уайт",
    price: 240,
    category: "coffee",
  },
  {
    id: "p6",
    name: "Эспрессо",
    price: 150,
    category: "coffee",
  },
  {
    id: "p7",
    name: "Чай Эрл Грей",
    price: 160,
    category: "tea",
  },
  {
    id: "p8",
    name: "Зеленый чай",
    price: 160,
    category: "tea",
  },
  {
    id: "p9",
    name: "Черничный маффин",
    price: 180,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "p10",
    name: "Круассан",
    price: 160,
    category: "dessert",
  },
];

const Register = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const { toast } = useToast();

  // Filter products based on search and category
  const filteredProducts = mockProducts.filter(product => 
    (activeTab === "all" || product.category === activeTab) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        // If product already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string, removeAll: boolean = false) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        if (removeAll || updatedCart[existingItemIndex].quantity === 1) {
          // Remove product entirely
          return updatedCart.filter(item => item.product.id !== productId);
        } else {
          // Decrease quantity
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity - 1
          };
          return updatedCart;
        }
      }
      return prevCart;
    });
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  // Handle opening/closing shift
  const toggleShift = () => {
    if (isShiftOpen) {
      toast.success("Смена закрыта");
    } else {
      toast.success("Смена открыта");
    }
    setIsShiftOpen(!isShiftOpen);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    
    toast.success("Заказ оформлен");
    setCart([]);
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "tea":
        return <CupSoda className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout title="Касса">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isShiftOpen ? "Смена открыта" : "Смена закрыта"}
        </h2>
        <Button
          variant={isShiftOpen ? "destructive" : "default"}
          onClick={toggleShift}
          disabled={!isShiftOpen && cart.length > 0}
        >
          {isShiftOpen ? "Закрыть смену" : "Открыть смену"}
        </Button>
      </div>

      {isShiftOpen ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск товара..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="coffee">Кофе</TabsTrigger>
                <TabsTrigger value="tea">Чай</TabsTrigger>
                <TabsTrigger value="dessert">Десерты</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">Товары не найдены</p>
                    </div>
                  ) : (
                    filteredProducts.map(product => (
                      <Card 
                        key={product.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-0">
                          {product.image ? (
                            <div className="h-24 w-full bg-muted">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-24 w-full bg-primary/5 flex items-center justify-center">
                              {getCategoryIcon(product.category)}
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{product.name}</h3>
                              <div className="bg-primary/10 px-2 py-0.5 rounded text-sm text-primary font-medium">
                                {product.price} ₽
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Текущий заказ
                  </h3>
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setCart([])}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Очистить
                    </Button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">Корзина пуста</p>
                    <p className="text-xs text-muted-foreground">
                      Добавьте товары из меню слева
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.product.price} ₽ × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => addToCart(item.product)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground ml-1"
                            onClick={() => removeFromCart(item.product.id, true)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Подытог:</span>
                    <span className="font-medium">{cartTotal} ₽</span>
                  </div>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    <Check className="h-4 w-4" />
                    Оформить заказ ({cartTotal} ₽)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-10 text-center">
          <div className="mb-4">
            <Receipt className="h-16 w-16 mx-auto text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-medium mb-2">Смена закрыта</h3>
          <p className="text-muted-foreground mb-6">
            Для начала работы с кассой необходимо открыть смену
          </p>
          <Button onClick={toggleShift}>Открыть смену</Button>
        </Card>
      )}
    </AppLayout>
  );
};

export default Register;
