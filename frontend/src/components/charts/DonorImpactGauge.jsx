import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const data = [
  {
    name: "Impacto",
    value: 75,
    fill: "hsl(var(--destructive))",
  },
];

export function DonorImpactGauge() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nivel de Impacto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-4xl font-bold text-foreground">
              {data[0].value}%
            </span>
            <p className="text-sm text-muted-foreground">Impacto Anual</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
