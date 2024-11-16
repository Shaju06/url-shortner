/* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Location({
  stats,
}: {
  stats: Record<string, string | number>[];
}) {
  const cityCount = stats.reduce((acc: any, item: any) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }
    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart width={700} height={300} data={cities.slice(0, 5)}>
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip labelStyle={{ color: "green" }} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
