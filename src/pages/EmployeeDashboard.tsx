
import AppLayout from "@/components/AppLayout";
import FeatureButton from "@/components/FeatureButton";
import { useAuth } from "@/context/AuthContext";
import { 
  Coffee, 
  Clipboard, 
  Calendar, 
  MessageSquare,
  CreditCard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // Mock data for upcoming shifts
  const upcomingShifts = [
    { day: "Понедельник", date: "14 августа", time: "08:00 - 20:00" },
    { day: "Среда", date: "16 августа", time: "14:00 - 22:00" },
    { day: "Пятница", date: "18 августа", time: "08:00 - 20:00" }
  ];

  return (
    <AppLayout title="Главная">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Добро пожаловать, {user?.name.split(' ')[0]}
        </h2>
        <p className="text-muted-foreground">
          {user?.coffeeshopName}
        </p>
      </div>

      <div className="mb-8">
        <Card className="bg-cream-light border-coffee/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-coffee/10 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-coffee" />
              </div>
              <div>
                <h3 className="font-medium">Текущая смена</h3>
                <p className="text-sm text-muted-foreground">Сегодня, 08:00 - 20:00</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-border">
                <p className="text-sm text-muted-foreground">Продано напитков</p>
                <p className="text-xl font-semibold">42</p>
              </div>
              <div className="p-3 rounded-lg bg-white/80 shadow-sm border border-border">
                <p className="text-sm text-muted-foreground">Выручка</p>
                <p className="text-xl font-semibold">15 400 ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-medium mb-4">Ближайшие смены</h3>
      <Card className="mb-8 overflow-hidden">
        <div className="divide-y divide-border">
          {upcomingShifts.map((shift, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">{shift.day}</p>
                <p className="text-sm text-muted-foreground">{shift.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {shift.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <h3 className="text-lg font-medium mb-4">Инструменты</h3>
      <div className="grid gap-3 mb-8">
        <FeatureButton 
          icon={Clipboard}
          title="Техкарта"
          description="Рецепты и способы приготовления"
          to="/technical-cards"
        />
        <FeatureButton 
          icon={Calendar}
          title="График смен"
          description="Управление рабочим расписанием"
          to="/schedule"
        />
        <FeatureButton 
          icon={CreditCard}
          title="Касса"
          description="Проведение продаж и чеки"
          to="/register"
        />
        <FeatureButton 
          icon={MessageSquare}
          title="Чат кофейни"
          description="Общение с коллегами"
          to="/chat"
        />
      </div>
    </AppLayout>
  );
};

export default EmployeeDashboard;
