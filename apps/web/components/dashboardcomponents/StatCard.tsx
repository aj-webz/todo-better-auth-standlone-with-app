import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface StatCardProps {
  label: string;
  total: number;
  value: number;
  variant: "today" | "pending" | "completed" | "backlog" | "cancelled";
}

const variantStyles: Record<StatCardProps["variant"], string> = {
  today: "text-blue-600",
  pending: "text-yellow-600",
  completed: "text-green-600",
  backlog: "text-gray-700",
  cancelled: "text-red-600",
};

const descriptionMap: Record<StatCardProps["variant"], string> = {
  today: "Tasks created today",
  pending: "Currently in progress",
  completed: "Successfully finished tasks",
  backlog: "Tasks waiting to start",
  cancelled: "Tasks that were cancelled",
};

export default function StatCard({
  label,
  value,
  total,
  variant,
}: StatCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const radius = 50;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="rounded-lg border border-gray-100 shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[12px] text-muted-foreground">
            {label.toUpperCase()}
          </span>

          <span
            className={cn(
              "font-bold text-5xl tracking-tight",
              variantStyles[variant]
            )}
          >
            {value}
          </span>
          <span className="text-muted-foreground text-xs">
            {descriptionMap[variant]}
          </span>
        </div>

        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              cx={radius}
              cy={radius}
              fill="transparent"
              r={normalizedRadius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
            />

            <circle
              className={variantStyles[variant]}
              cx={radius}
              cy={radius}
              fill="transparent"
              r={normalizedRadius}
              stroke="currentColor"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeLinecap="round"
              strokeWidth={stroke}
              style={{
                strokeDashoffset,
                transition: "stroke-dashoffset 0.7s ease-out",
              }}
            />
          </svg>

          <div className="absolute font-semibold text-sm">
            {Math.round(percentage)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
