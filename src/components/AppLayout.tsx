
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationBar from "./NavigationBar";
import ProfileDrawer from "./ProfileDrawer";
import NotificationPanel from "./NotificationPanel";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  hideNavigation?: boolean;
}

const AppLayout = ({
  children,
  title,
  showBackButton = false,
  hideNavigation = false,
}: AppLayoutProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-18 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {title && <h1 className="text-lg font-medium">{title}</h1>}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "max-w-screen-lg mx-auto px-4 py-6",
        hideNavigation && "pb-6"
      )}>
        {children}
      </main>

      {/* Navigation */}
      {!hideNavigation && <NavigationBar />}

      {/* Drawers & Panels */}
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
};

export default AppLayout;
