
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  BadgeRussianRuble, 
  Calendar, 
  Download, 
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Types
interface Employee {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  baseSalary: number;
  deliveryBonus: number;
  revenuePercent: number;
}

interface EmployeeSalary {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  deliveryBonus: number;
  revenueBonus: number;
  total: number;
  isPaid: boolean;
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "e1",
    name: "Мария Сотрудник",
    avatar: "https://i.pravatar.cc/150?img=5",
    position: "Бариста",
    baseSalary: 35000,
    deliveryBonus: 50,
    revenuePercent: 3,
  },
  {
    id: "e2",
    name: "Иван Петров",
    avatar: "https://i.pravatar.cc/150?img=12",
    position: "Старший бариста",
    baseSalary: 45000,
    deliveryBonus: 50,
    revenuePercent: 4,
  },
  {
    id: "e3",
    name: "Алексей Смирнов",
    avatar: "https://i.pravatar.cc/150?img=15",
    position: "Бариста",
    baseSalary: 32000,
    deliveryBonus: 50,
    revenuePercent: 3,
  },
  {
    id: "e4",
    name: "Екатерина Иванова",
    avatar: "https://i.pravatar.cc/150?img=9",
    position: "Бариста-стажер",
    baseSalary: 28000,
    deliveryBonus: 40,
    revenuePercent: 2,
  },
];

const mockSalaries: EmployeeSalary[] = [
  {
    id: "s1",
    employeeId: "e1",
    month: "2023-07",
    baseSalary: 35000,
    deliveryBonus: 5200,
    revenueBonus: 12450,
    total: 52650,
    isPaid: true,
  },
  {
    id: "s2",
    employeeId: "e2",
    month: "2023-07",
    baseSalary: 45000,
    deliveryBonus: 4300,
    revenueBonus: 16600,
    total: 65900,
    isPaid: true,
  },
  {
    id: "s3",
    employeeId: "e3",
    month: "2023-07",
    baseSalary: 32000,
    deliveryBonus: 3600,
    revenueBonus: 11250,
    total: 46850,
    isPaid: true,
  },
  {
    id: "s4",
    employeeId: "e1",
    month: "2023-08",
    baseSalary: 35000,
    deliveryBonus: 6100,
    revenueBonus: 13200,
    total: 54300,
    isPaid: false,
  },
];

const months = [
  { value: "2023-08", label: "Август 2023" },
  { value: "2023-07", label: "Июль 2023" },
  { value: "2023-06", label: "Июнь 2023" },
  { value: "2023-05", label: "Май 2023" },
];

const Salary = () => {
  const [selectedMonth, setSelectedMonth] = useState("2023-08");
  const [employeeDetails, setEmployeeDetails] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees based on search
  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle employee details view
  const toggleEmployeeDetails = (employeeId: string) => {
    if (employeeDetails === employeeId) {
      setEmployeeDetails(null);
    } else {
      setEmployeeDetails(employeeId);
    }
  };

  // Get employee salary data for selected month
  const getEmployeeSalary = (employeeId: string) => {
    return mockSalaries.find(
      s => s.employeeId === employeeId && s.month === selectedMonth
    );
  };

  // Get employee data by ID
  const getEmployee = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId);
  };

  // Handle salary payment
  const handlePaySalary = (salaryId: string) => {
    toast.success("Зарплата отмечена как выплаченная");
    // In a real app, this would update the database
  };

  // Handle download report
  const handleDownloadReport = () => {
    toast.success("Отчет о зарплате скачан");
    // In a real app, this would generate and download a PDF or Excel file
  };

  return (
    <AppLayout title="Заработная плата" showBackButton>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Расчет зарплаты</h2>
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите месяц" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск сотрудника..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4 mb-8">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Сотрудники не найдены</p>
          </div>
        ) : (
          filteredEmployees.map(employee => {
            const salary = getEmployeeSalary(employee.id);
            const isActive = employeeDetails === employee.id;
            
            return (
              <Card key={employee.id} className="overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleEmployeeDetails(employee.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {salary ? (
                        <div className="text-right">
                          <p className="font-medium">{salary.total.toLocaleString()} ₽</p>
                          <p className="text-xs text-muted-foreground">
                            {salary.isPaid ? "Выплачено" : "Не выплачено"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Нет данных</p>
                      )}
                      {isActive ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isActive && (
                  <CardContent className="border-t border-border p-4 bg-muted/30">
                    {salary ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Базовая ставка</p>
                            <p className="font-medium">{salary.baseSalary.toLocaleString()} ₽</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Бонус за доставку</p>
                            <p className="font-medium">{salary.deliveryBonus.toLocaleString()} ₽</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Бонус от выручки</p>
                            <p className="font-medium">{salary.revenueBonus.toLocaleString()} ₽</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Процент от выручки</p>
                            <p className="font-medium">{employee.revenuePercent}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Итого к выплате</p>
                            <p className="text-xl font-semibold">{salary.total.toLocaleString()} ₽</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleDownloadReport()}
                            >
                              <Download className="h-4 w-4" />
                              Отчет
                            </Button>
                            {!salary.isPaid && (
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handlePaySalary(salary.id)}
                              >
                                <BadgeRussianRuble className="h-4 w-4" />
                                Отметить выплату
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Calendar className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">Нет данных о зарплате за этот месяц</p>
                        <Button size="sm" className="mt-4">
                          Создать расчет
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};

export default Salary;
