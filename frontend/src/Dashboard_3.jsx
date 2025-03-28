import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
    </LineChart>
  );
}
