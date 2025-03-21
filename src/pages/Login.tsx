
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Coffee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [coffeeshopName, setCoffeeshopName] = useState("");
  const [role, setRole] = useState<"owner" | "employee">("owner");
  
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        registerName,
        registerEmail,
        registerPassword,
        role,
        coffeeshopName
      );
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-cream-lightest">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-xl bg-coffee/5 backdrop-blur-sm border border-coffee/10">
            <Coffee className="h-10 w-10 text-coffee" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">Кофейня Менеджер</h1>
        <p className="text-center text-muted-foreground mb-8">
          Управляйте кофейней эффективно
        </p>
        
        <Card className="border-border/40 shadow-sm">
          <CardContent className="pt-6">
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Электронная почта</Label>
                    <Input
                      id="email"
                      placeholder="example@mail.ru"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Пароль</Label>
                      <Link 
                        to="#" 
                        className="text-xs text-primary hover:underline"
                      >
                        Забыли пароль?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      "Войти"
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <span>Нет аккаунта? </span>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab("register")}
                    >
                      Регистрация
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Имя</Label>
                    <Input
                      id="register-name"
                      placeholder="Иван Иванов"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Электронная почта</Label>
                    <Input
                      id="register-email"
                      placeholder="example@mail.ru"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      placeholder="••••••••"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coffeeshop-name">Название кофейни</Label>
                    <Input
                      id="coffeeshop-name"
                      placeholder="Кофейня 'Аромат'"
                      value={coffeeshopName}
                      onChange={(e) => setCoffeeshopName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Роль</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="role-owner"
                          name="role"
                          className="w-4 h-4 text-primary border-border"
                          checked={role === "owner"}
                          onChange={() => setRole("owner")}
                        />
                        <Label htmlFor="role-owner" className="ml-2 cursor-pointer">
                          Владелец
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="role-employee"
                          name="role"
                          className="w-4 h-4 text-primary border-border"
                          checked={role === "employee"}
                          onChange={() => setRole("employee")}
                        />
                        <Label htmlFor="role-employee" className="ml-2 cursor-pointer">
                          Сотрудник
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Регистрация...
                      </>
                    ) : (
                      "Зарегистрироваться"
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <span>Уже есть аккаунт? </span>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab("login")}
                    >
                      Войти
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Кофейня Менеджер
        </p>
      </div>
    </div>
  );
};

export default Login;
