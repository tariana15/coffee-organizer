
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, LineChart, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NavigationBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isOwner = user?.role === "owner";

  const links = [
    {
      to: isOwner ? "/dashboard" : "/employee-dashboard",
      icon: Home,
      label: "Главная",
    },
    {
      to: "/inventory",
      icon: ShoppingBag,
      label: "Товары",
      ownerOnly: true
    },
    {
      to: "/analytics",
      icon: LineChart,
      label: "Аналитика",
      ownerOnly: true
    },
    {
      to: "/register",
      icon: CreditCard,
      label: "Касса",
    },
  ];

  const filteredLinks = links.filter(link => 
    !link.ownerOnly || (link.ownerOnly && isOwner)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 
                    h-16 sm:h-18 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <nav className="h-full max-w-screen-lg mx-auto px-4">
        <ul className="h-full flex items-center justify-around">
          {filteredLinks.map((link) => (
            <li key={link.to} className="flex-1">
              <Link
                to={link.to}
                className={cn(
                  "nav-item", 
                  location.pathname === link.to && "active"
                )}
              >
                <link.icon className={cn(
                  "nav-icon",
                  location.pathname === link.to 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )} />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
