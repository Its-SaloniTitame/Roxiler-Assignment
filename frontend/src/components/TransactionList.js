import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [month, setMonth] = useState(1); // Default month (January)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch transactions for the given month and search query
    getTransactions(month, page, perPage, search)
      .then((response) => {
        setTransactions(response.data.transactions);  // This is fine, no reassignment to 'transactions' constant
      })
      .catch((err) => {
        setError('Error fetching transactions');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [month, search, page, perPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when searching
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to page 1 when changing month
  };

  // Render loading or error state
  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by title or description"
      />

      {/* Month selector */}
      <select value={month} onChange={handleMonthChange}>
        {[...Array(12).keys()].map((i) => (
          <option key={i} value={i + 1}>
            {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
          </option>
        ))}
      </select>

      {/* Table to display transactions */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.category}</td>
              <td>{transaction.price}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionList;
