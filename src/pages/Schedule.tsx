
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon
} from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  getDay,
  subMonths 
} from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define types
interface Shift {
  id: string;
  date: Date;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  startTime: string;
  endTime: string;
  revenue?: number;
}

const mockShifts: Shift[] = [
  {
    id: "s1",
    date: new Date(2023, 7, 14), // August 14, 2023
    employeeId: "e1",
    employeeName: "Мария Сотрудник",
    avatar: "https://i.pravatar.cc/150?img=5",
    startTime: "08:00",
    endTime: "20:00",
    revenue: 42000,
  },
  {
    id: "s2",
    date: new Date(2023, 7, 15), // August 15, 2023
    employeeId: "e2",
    employeeName: "Иван Петров",
    avatar: "https://i.pravatar.cc/150?img=12",
    startTime: "08:00",
    endTime: "20:00",
    revenue: 38500,
  },
  {
    id: "s3",
    date: new Date(2023, 7, 16), // August 16, 2023
    employeeId: "e1",
    employeeName: "Мария Сотрудник",
    avatar: "https://i.pravatar.cc/150?img=5",
    startTime: "14:00",
    endTime: "22:00",
    revenue: 28000,
  },
  {
    id: "s4",
    date: new Date(2023, 7, 17), // August 17, 2023
    employeeId: "e3",
    employeeName: "Алексей Смирнов",
    avatar: "https://i.pravatar.cc/150?img=15",
    startTime: "08:00",
    endTime: "20:00",
    revenue: 41200,
  },
  {
    id: "s5",
    date: new Date(2023, 7, 18), // August 18, 2023
    employeeId: "e1",
    employeeName: "Мария Сотрудник",
    avatar: "https://i.pravatar.cc/150?img=5",
    startTime: "08:00",
    endTime: "20:00",
    revenue: 45600,
  },
];

const Schedule = () => {
  const { user } = useAuth();
  const isOwner = user?.role === "owner";
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Current month days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add empty cells at the beginning to align with the weekday
  const startDay = getDay(monthStart);
  const emptyCells = Array.from({ length: startDay }, (_, i) => i);
  
  // Navigation functions
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get shifts for a specific day
  const getShiftsForDay = (day: Date) => {
    return mockShifts.filter(shift => isSameDay(shift.date, day));
  };
  
  // Get shifts for selected day
  const selectedDayShifts = selectedDate ? getShiftsForDay(selectedDate) : [];
  
  // Weekday names
  const weekdayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <AppLayout title="График смен" showBackButton>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-medium">
            {format(currentMonth, "LLLL yyyy", { locale: ru })}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {isOwner && (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Новая смена
          </Button>
        )}
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="grid grid-cols-7 text-center">
          {weekdayNames.map((day) => (
            <div key={day} className="py-2 border-b border-border font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {emptyCells.map((i) => (
            <div key={`empty-${i}`} className="p-2 h-16 border border-border"></div>
          ))}
          
          {monthDays.map((day) => {
            const shiftsOnDay = getShiftsForDay(day);
            const hasShifts = shiftsOnDay.length > 0;
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={day.toString()}
                className={`p-1 h-16 border border-border relative cursor-pointer
                ${isToday ? "bg-primary/5" : ""}
                ${isSelected ? "bg-primary/10" : ""}
                ${!isSameMonth(day, currentMonth) ? "text-muted-foreground" : ""}
                hover:bg-muted/50 transition-colors overflow-hidden`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-right mb-1">
                  <span className={`text-sm inline-block w-6 h-6 rounded-full
                    ${isToday ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                
                {hasShifts && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {shiftsOnDay.slice(0, 2).map((shift) => (
                      <div
                        key={shift.id}
                        className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
                        title={shift.employeeName}
                      >
                        <span className="text-xs text-primary">
                          {shift.employeeName.charAt(0)}
                        </span>
                      </div>
                    ))}
                    {shiftsOnDay.length > 2 && (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{shiftsOnDay.length - 2}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {selectedDate && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">
              {format(selectedDate, "d MMMM, EEEE", { locale: ru })}
            </h3>
          </div>
          
          {selectedDayShifts.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Нет смен на этот день</p>
              {isOwner && (
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить смену
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDayShifts.map((shift) => (
                <Card key={shift.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{shift.employeeName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{shift.employeeName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                    {isOwner && shift.revenue && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Выручка</p>
                        <p className="font-medium">{shift.revenue.toLocaleString()} ₽</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Schedule;
