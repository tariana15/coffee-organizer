
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect based on user role
        if (user?.role === "owner") {
          navigate("/dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-lightest">
      <div className="animate-pulse-subtle">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-coffee/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-coffee animate-pulse" />
        </div>
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  );
};

export default Index;
