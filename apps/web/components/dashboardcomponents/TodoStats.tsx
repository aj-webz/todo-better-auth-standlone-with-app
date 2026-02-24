import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  variant: "today" | "pending" | "completed" | "backlog";
}

const variantConfig = {
  today: {
    icon: CalendarDays,
    valueColor: "text-foreground",
    iconColor: "text-foreground",
  },
  pending: {
    icon: Clock,
    valueColor: "text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  completed: {
    icon: CheckCircle2,
    valueColor: "text-green-600",
    iconColor: "text-green-600",
  },

  backlog: {
    icon: CheckCircle2,
    valueColor: "text-gray-700",
    iconColor: "text-green-600",
  },
  cancelled: {
    icon: XCircle,
    valueColor: "text-red-600",
    iconColor: "text-red-600",
  },
};

export function StatCard({ label, value, variant }: StatCardProps) {
  const Icon = variantConfig[variant].icon;

  return (
    <Card className="border shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex flex-col">
          <span className="font-medium text-[14px] text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <span
            className={cn(
              "font-extrabold text-6xl tracking-tight",
              variantConfig[variant].valueColor
            )}
          >
            {value}
          </span>
        </div>

        <div
          className={cn(
            "rounded-full bg-muted/40 p-4",
            variantConfig[variant].iconColor
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
      </CardContent>
    </Card>
  );
}
