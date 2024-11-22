// src/components/BarChart.js
import React, { useState, useEffect } from 'react';
import { getBarChartData } from '../services/api';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch bar chart data for the given month
    getBarChartData(month)
      .then((response) => {
        setData(response.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        setError('Error fetching bar chart data');
        setLoading(false); // Stop loading even on error
      });
  }, [month]);

  const chartData = {
    labels: data.map((item) => item.range),
    datasets: [
      {
        label: 'Transactions by Price Range',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Render loading or error state
  if (loading) {
    return <div className="chart-loading">Loading bar chart...</div>;
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  return <Bar data={chartData} />;
};

export default BarChart;
