// src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import { getPieChartData } from '../services/api';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch pie chart data for the given month
    getPieChartData(month)
      .then((response) => {
        setData(response.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        setError('Error fetching pie chart data');
        setLoading(false); // Stop loading even on error
      });
  }, [month]);

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
      },
    ],
  };

  // Render loading or error state
  if (loading) {
    return <div className="chart-loading">Loading pie chart...</div>;
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  return <Pie data={chartData} />;
};

export default PieChart;
