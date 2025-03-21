
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import MetricCard from "@/components/MetricCard";
import FeatureButton from "@/components/FeatureButton";
import { useAuth } from "@/context/AuthContext";
import { 
  CoffeeIcon, 
  Receipt, 
  Clipboard, 
  Calendar, 
  BadgeRussianRuble
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Dashboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("today");

  // Mock data for revenue
  const revenue = {
    today: "45 600 ₽",
    week: "285 300 ₽",
    month: "1 245 000 ₽"
  };

  const profit = {
    today: "22 800 ₽",
    week: "142 650 ₽",
    month: "622 500 ₽"
  };

  const averageCheck = {
    today: "410 ₽",
    week: "425 ₽",
    month: "430 ₽"
  };

  // Mock data for recent receipts
  const recentReceipts = [
    { id: "R-1005", time: "15:42", amount: "450 ₽", items: 3 },
    { id: "R-1004", time: "14:21", amount: "620 ₽", items: 4 },
    { id: "R-1003", time: "13:05", amount: "380 ₽", items: 2 },
    { id: "R-1002", time: "11:47", amount: "520 ₽", items: 3 },
    { id: "R-1001", time: "10:30", amount: "320 ₽", items: 1 }
  ];

  return (
    <AppLayout title="Главная">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Добро пожаловать, {user?.name.split(' ')[0]}
        </h2>
        <Select
          value={period}
          onValueChange={setPeriod}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Сегодня</SelectItem>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricCard
          title="Выручка"
          value={revenue[period as keyof typeof revenue]}
          icon={CoffeeIcon}
          trend={{ value: 12, isPositive: true }}
          aspectRatio="wide"
          className="col-span-2"
        />
        <MetricCard
          title="Прибыль"
          value={profit[period as keyof typeof profit]}
          icon={BadgeRussianRuble}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Средний чек"
          value={averageCheck[period as keyof typeof averageCheck]}
          icon={Receipt}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <h3 className="text-lg font-medium mb-4">Чеки за сегодня</h3>
      <Card className="mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">№</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Время</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Сумма</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Товары</th>
              </tr>
            </thead>
            <tbody>
              {recentReceipts.map((receipt) => (
                <tr key={receipt.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm">{receipt.id}</td>
                  <td className="py-3 px-4 text-sm">{receipt.time}</td>
                  <td className="py-3 px-4 text-sm font-medium">{receipt.amount}</td>
                  <td className="py-3 px-4 text-sm">{receipt.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          description="Расписание работы сотрудников"
          to="/schedule"
        />
        <FeatureButton 
          icon={BadgeRussianRuble}
          title="Заработная плата"
          description="Расчёт зарплаты сотрудников"
          to="/salary"
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
