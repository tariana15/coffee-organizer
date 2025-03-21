
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureButtonProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  to: string;
  className?: string;
}

const FeatureButton = ({
  icon: Icon,
  title,
  description,
  to,
  className,
}: FeatureButtonProps) => {
  return (
    <Link to={to} className={cn("feature-button", className)}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default FeatureButton;
