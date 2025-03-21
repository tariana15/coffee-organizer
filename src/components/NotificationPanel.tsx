
import { useState, useEffect, useRef } from "react";
import { X, Bell, Coffee, ShoppingBag, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "inventory" | "schedule" | "sales" | "alert";
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications
const demoNotifications: Notification[] = [
  {
    id: "1",
    title: "Низкий уровень запасов",
    message: "Молоко (3%) заканчивается. Осталось менее 2 литров.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    type: "inventory"
  },
  {
    id: "2",
    title: "Новая смена назначена",
    message: "Вы назначены на смену в воскресенье, 18 августа",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: "schedule"
  },
  {
    id: "3",
    title: "Рекордные продажи",
    message: "Вчера достигнут рекорд продаж: 135 000 ₽",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    type: "sales"
  },
  {
    id: "4",
    title: "Зерна Эфиопия заканчиваются",
    message: "Осталось менее 500 г зерен Эфиопия Сидамо",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: "inventory"
  },
  {
    id: "5",
    title: "Внимание! Проблема с оборудованием",
    message: "Кофемолка требует технического обслуживания",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    read: true,
    type: "alert"
  }
];

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [animationClass, setAnimationClass] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setAnimationClass("animate-slide-in-right");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const closePanel = () => {
    setAnimationClass("animate-slide-out-right");
    setTimeout(() => {
      onClose();
      setAnimationClass("");
    }, 300);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "inventory":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "schedule":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "sales":
        return <Coffee className="h-5 w-5 text-coffee" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date) => {
    return format(date, "H:mm", { locale: ru });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return format(date, "d MMMM", { locale: ru });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen && !animationClass) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div 
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-background shadow-lg 
                   flex flex-col transform ${animationClass}`}
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Уведомления</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button size="icon" variant="ghost" onClick={closePanel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 py-2 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 
              ? `У вас ${unreadCount} непрочитанных уведомлений` 
              : "Нет новых уведомлений"}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Прочитать все
          </Button>
        </div>
        
        <Separator className="mb-2" />
        
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Уведомлений нет</p>
              <p className="text-sm text-muted-foreground/70">
                Здесь будут отображаться все важные уведомления
              </p>
            </div>
          ) : (
            <div className="px-4 py-2">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 mb-2 rounded-lg transition-colors ${
                    notification.read ? "bg-transparent" : "bg-accent"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
