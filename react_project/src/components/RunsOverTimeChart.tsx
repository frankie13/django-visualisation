import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";

interface Run {
  sample_id: string;
  run_id: string;
  status: "completed" | "failed" | "queued" | "processing" | string;
  read_count: number;
  created_at: string;      // ISO date string
}

const API_URL = "http://localhost:8000/api/data/";

const statusColor: Record<string, string> = {
  completed: "#4caf50",
  failed: "#f44336",
  queued: "#ff9800",
  processing: "#2196f3",
};

const RunsOverTimeChart: React.FC = () => {
  const [data, setData] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_URL, { credentials: "include" });
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const json = await res.json();

        // If read_count might still be string, coerce here:
        const runs: Run[] = json.map((item: any) => ({
          ...item,
          read_count: Number(item.read_count),
        }));

        // sort by date ascending
        runs.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );

        setData(runs);
      } catch (e: any) {
        setError(e.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading runs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data.length) return <p>No runs found.</p>;

  // For a simple first pass, use a ScatterChart with color by status
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Read count per run over time</h2>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            dataKey="created_at"
            tickFormatter={(d) => d.slice(5)} // show MM-DD
          />
          <YAxis dataKey="read_count" />
          <Tooltip
            formatter={(value: any, name: any) => [value, name]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {/* One scatter per status to get a legend and colors */}
          {["completed", "failed", "queued", "processing"].map((status) => (
            <Scatter
              key={status}
              name={status}
              data={data.filter((d) => d.status === status)}
              fill={statusColor[status]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunsOverTimeChart;
