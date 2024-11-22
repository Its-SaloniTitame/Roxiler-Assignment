// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch statistics for the given month
    getStatistics(month)
      .then((response) => {
        setStatistics(response.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        setError('Error fetching statistics');
        setLoading(false); // Stop loading even on error
      });
  }, [month]);

  // Render loading or error state
  if (loading) {
    return <div className="statistics-loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="statistics-error">{error}</div>;
  }

  return (
    <div>
      <h3>Total Amount: {statistics.totalAmount}</h3>
      <h3>Total Sold Items: {statistics.totalSoldItems}</h3>
      <h3>Total Unsold Items: {statistics.totalNotSoldItems}</h3>
    </div>
  );
};

export default Statistics;
