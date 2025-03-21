
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Coffee, 
  LogOut, 
  Settings, 
  Users, 
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDrawer = ({ isOpen, onClose }: ProfileDrawerProps) => {
  const { user, logout } = useAuth();
  const [animationClass, setAnimationClass] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        closeDrawer();
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
      setAnimationClass("animate-slide-in-left");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const closeDrawer = () => {
    setAnimationClass("animate-slide-out-left");
    setTimeout(() => {
      onClose();
      setAnimationClass("");
    }, 300);
  };

  if (!isOpen && !animationClass) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div 
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[380px] bg-background shadow-lg 
                   flex flex-col transform ${animationClass}`}
      >
        <div className="p-4 flex justify-end">
          <Button size="icon" variant="ghost" onClick={closeDrawer}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-6 py-4 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-xl">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
          
          <div className="mt-4 bg-accent rounded-lg p-4 w-full">
            <div className="flex items-center gap-3">
              <Coffee className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{user?.coffeeshopName}</p>
                <p className="text-xs text-muted-foreground">Кофейня</p>
              </div>
            </div>
            
            {user?.role === "owner" && (
              <div className="flex items-center gap-3 mt-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">4 сотрудника</p>
                  <p className="text-xs text-muted-foreground">Управление персоналом</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="px-6 flex-1">
          <Button
            variant="outline"
            className="w-full justify-start mb-2 text-muted-foreground"
          >
            <Settings className="mr-2 h-4 w-4" />
            Настройки
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
        
        <div className="p-6 text-xs text-center text-muted-foreground">
          Версия 1.0.0
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
