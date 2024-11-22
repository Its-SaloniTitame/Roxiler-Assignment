// src/App.js
import React, { useState } from 'react';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Statistics from './components/Statistics';
import TransactionList from './components/TransactionList';

const App = () => {
  const [month, setMonth] = useState(1); // Default month (January)

  return (
    <div>
      <h1>Transaction Dashboard</h1>
      <div>
        <label>
          Select Month:
          <input
            type="number"
            value={month}
            min={1}
            max={12}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          />
        </label>
      </div>

      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
      <TransactionList month={month} />
    </div>
  );
};

export default App;
