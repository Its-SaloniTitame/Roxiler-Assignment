const axios = require('axios');
const Transaction = require('../models/Transaction');

// Transaction Controller: List transactions with search, pagination, and month filtering
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month = null } = req.query;

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    let externalTransactions = response.data;

    if (month) {
      externalTransactions = externalTransactions.filter(
        (transaction) => new Date(transaction.dateOfSale).getMonth() + 1 === parseInt(month)
      );
    }

    if (search) {
      externalTransactions = externalTransactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(search.toLowerCase()) ||
          transaction.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalCount = externalTransactions.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Number(page);
    const paginatedTransactions = externalTransactions.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    res.status(200).json({
      transactions: paginatedTransactions,
      totalCount,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Statistics Controller: Get statistics for selected month
const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Filter transactions by the provided month (ignoring the year)
    const filteredTransactions = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;  // Months are 0-indexed
      return transactionMonth === parseInt(month); // Compare month
    });

    // Calculate total amount, sold items, and unsold items
    const totalAmount = filteredTransactions.reduce((acc, curr) => acc + curr.price, 0);
    const totalSoldItems = filteredTransactions.filter(item => item.sold).length;
    const totalNotSoldItems = filteredTransactions.filter(item => !item.sold).length;

    return res.status(200).json({
      totalAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// Bar Chart Controller: Get bar chart data for price ranges in selected month
const getBarChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    const filteredTransactions = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
      return transactionMonth === parseInt(month);
    });

    const ranges = ['0-50', '51-100', '101-200', '201-500', '500+'];
    const categoryCounts = ranges.reduce((acc, range) => {
      acc[range] = filteredTransactions.filter(transaction => {
        const price = transaction.price;
        if (range === '0-50') return price <= 50;
        if (range === '51-100') return price > 50 && price <= 100;
        if (range === '101-200') return price > 100 && price <= 200;
        if (range === '201-500') return price > 200 && price <= 500;
        return price > 500;
      }).length;
      return acc;
    }, {});

    const barChartData = Object.keys(categoryCounts).map((range) => ({
      range,
      count: categoryCounts[range]
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error.message);
    res.status(500).json({ message: 'Error fetching bar chart data', error: error.message });
  }
};

// Pie Chart Controller: Get pie chart data for categories in selected month
const getPieChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    const filteredTransactions = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
      return transactionMonth === parseInt(month);
    });

    const categoryCounts = filteredTransactions.reduce((acc, curr) => {
      if (curr.category) {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
      }
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryCounts).map((category) => ({
      category,
      count: categoryCounts[category]
    }));

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error.message);
    res.status(500).json({ message: 'Error fetching pie chart data', error: error.message });
  }
};

// Seed Controller: Seed database with mock data
const seedDatabase = async (req, res) => {
  try {
    const transactions = Array.from({ length: 50 }).map(() => {
      const month = Math.floor(Math.random() * 12) + 1;
      const year = 2024;
      const randomPrice = Math.floor(Math.random() * 500) + 1;
      const randomSold = Math.random() < 0.5;

      return {
        title: `Product ${Math.floor(Math.random() * 100)}`,
        description: `Description for product ${Math.floor(Math.random() * 100)}`,
        price: randomPrice,
        category: ['Electronics', 'Clothing', 'Food', 'Books'][Math.floor(Math.random() * 4)],
        dateOfSale: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1),
        sold: randomSold
      };
    });

    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error.message);
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
};

module.exports = {
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  seedDatabase
};
