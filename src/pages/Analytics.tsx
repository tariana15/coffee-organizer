
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const revenueData = [
  { name: "Пн", value: 42000 },
  { name: "Вт", value: 38500 },
  { name: "Ср", value: 45600 },
  { name: "Чт", value: 39800 },
  { name: "Пт", value: 52400 },
  { name: "Сб", value: 68000 },
  { name: "Вс", value: 58200 },
];

const productData = [
  { name: "Капучино", value: 128 },
  { name: "Латте", value: 94 },
  { name: "Американо", value: 62 },
  { name: "Раф", value: 48 },
  { name: "Флэт Уайт", value: 36 },
];

const hourlyData = [
  { name: "8:00", value: 12 },
  { name: "9:00", value: 18 },
  { name: "10:00", value: 25 },
  { name: "11:00", value: 22 },
  { name: "12:00", value: 30 },
  { name: "13:00", value: 35 },
  { name: "14:00", value: 28 },
  { name: "15:00", value: 22 },
  { name: "16:00", value: 20 },
  { name: "17:00", value: 25 },
  { name: "18:00", value: 32 },
  { name: "19:00", value: 20 },
  { name: "20:00", value: 15 },
];

const monthlyRevenueData = [
  { name: "Янв", value: 1245000 },
  { name: "Фев", value: 1120000 },
  { name: "Мар", value: 1350000 },
  { name: "Апр", value: 1480000 },
  { name: "Май", value: 1520000 },
  { name: "Июн", value: 1680000 },
  { name: "Июл", value: 1750000 },
  { name: "Авг", value: 1620000 },
];

const Analytics = () => {
  const [period, setPeriod] = useState("week");
  
  // Calculated metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  const avgCheck = Math.round(totalRevenue / 415); // 415 is the mock total orders
  const topProduct = productData.reduce((max, item) => 
    max.value > item.value ? max : item
  );
  const peakHour = hourlyData.reduce((max, item) => 
    max.value > item.value ? max : item
  );

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} ₽`;
  };

  return (
    <AppLayout title="Аналитика">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Показатели бизнеса</h2>
        <Select
          value={period}
          onValueChange={setPeriod}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
            <SelectItem value="year">Год</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Общая выручка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{formatCurrency(totalRevenue)}</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    hide 
                    domain={[0, 'dataMax + 10000']}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Выручка']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Топ продуктов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{topProduct.name} ({topProduct.value})</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    hide 
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} шт`, 'Продано']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="hourly">По часам</TabsTrigger>
          <TabsTrigger value="monthly">По месяцам</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Средний чек</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgCheck)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">415</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Пиковое время</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{peakHour.name}</div>
                <div className="text-sm text-muted-foreground">{peakHour.value} заказов</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Постоянные клиенты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <div className="text-sm text-muted-foreground">от всех заказов</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>Активность по часам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={hourlyData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} заказов`, 'Количество']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorActivity)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Выручка по месяцам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString()} ₽`, 'Выручка']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Analytics;
