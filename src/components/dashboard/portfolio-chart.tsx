
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the portfolio value over time
const portfolioData = [
  { date: "May 1", value: 48750 },
  { date: "May 2", value: 49200 },
  { date: "May 3", value: 48900 },
  { date: "May 4", value: 49950 },
  { date: "May 5", value: 50200 },
  { date: "May 6", value: 49800 },
  { date: "May 7", value: 50950 },
  { date: "May 8", value: 51200 },
  { date: "May 9", value: 51800 },
  { date: "May 10", value: 52500 },
  { date: "May 11", value: 52100 },
  { date: "May 12", value: 52700 },
  { date: "May 13", value: 53100 },
  { date: "May 14", value: 52800 },
];

export function PortfolioChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={portfolioData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
                width={80}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]} 
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2, fill: "white" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
