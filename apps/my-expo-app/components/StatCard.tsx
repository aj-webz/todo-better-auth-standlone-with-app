import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";


export type Variant = "today" | "pending" | "completed" | "backlog" | "cancelled";

export interface StatCardProps {
  label: string;
  value: number;
  total: number;
  variant: Variant;
}


const COLORS: Record<Variant, { accent: string; bg: string; border: string }> = {
  today:     { accent: "#60A5FA", bg: "#0D1F33", border: "#1E3A5F" },
  pending:   { accent: "#FBBF24", bg: "#1F1500", border: "#3D2E0A" },
  completed: { accent: "#34D399", bg: "#051A10", border: "#0D3322" },
  backlog:   { accent: "#9CA3AF", bg: "#111827", border: "#1F2937" },
  cancelled: { accent: "#F87171", bg: "#1A0505", border: "#3B1010" },
};

const DESCRIPTION: Record<Variant, string> = {
  today:     "Created today",
  pending:   "In progress",
  completed: "Finished",
  backlog:   "Not started",
  cancelled: "Cancelled",
};


function CircularProgress({ percentage, accent }: { percentage: number; accent: string }) {
  const radius = 28;
  const stroke = 4;
  const norm = radius - stroke / 2;
  const circumference = norm * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <Svg height={radius * 2} width={radius * 2}>

        <Circle
          stroke="#2A2A2A"
          fill="transparent"
          strokeWidth={stroke}
          r={norm}
          cx={radius}
          cy={radius}
        />
  
        <Circle
          stroke={accent}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={norm}
          cx={radius}
          cy={radius}
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />
      </Svg>
  
      <Text
        className="absolute text-[9px] font-bold"
        style={{ color: accent }}
      >
        {Math.round(percentage)}%
      </Text>
    </View>
  );
}

export default function StatCard({ label, value, total, variant }: StatCardProps) {
  const { accent, bg, border } = COLORS[variant];
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <View
      className="rounded-2xl px-4 py-4 mr-3 w-36"
      style={{ backgroundColor: bg, borderWidth: 1, borderColor: border }}
    >

      <Text className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase mb-3">
        {label}
      </Text>

      <Text className="text-4xl font-extrabold mb-1" style={{ color: accent }}>
        {value}
      </Text>

      <Text className="text-[11px] text-[#a9a9a9] mb-4">
        {DESCRIPTION[variant]}
      </Text>

 
      <CircularProgress percentage={percentage} accent={accent} />
    </View>
  );
}