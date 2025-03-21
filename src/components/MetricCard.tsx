
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  aspectRatio?: "square" | "wide";
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  className,
  aspectRatio = "square"
}: MetricCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-shadow duration-200 hover:shadow-md",
        aspectRatio === "wide" ? "col-span-2" : "",
        className
      )}
    >
      <div className={cn(
        "p-6 flex flex-col h-full",
        aspectRatio === "wide" ? "flex-row items-center" : ""
      )}>
        {Icon && (
          <div className={cn(
            "rounded-lg w-9 h-9 flex items-center justify-center mb-4",
            iconColor.startsWith("text-") ? `${iconColor}/10` : "bg-primary/10",
            aspectRatio === "wide" ? "mr-6 mb-0" : ""
          )}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
        
        <div className={aspectRatio === "wide" ? "flex-1" : ""}>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          
          <div className="mt-2 flex items-baseline justify-between">
            <p className={cn(
              "text-2xl font-semibold",
              aspectRatio === "wide" ? "text-3xl" : ""
            )}>
              {value}
            </p>
            
            {trend && (
              <div className={cn(
                "text-xs font-medium flex items-center gap-0.5 px-2 py-0.5 rounded",
                trend.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              )}>
                <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
