const express = require('express');
const { listTransactions, getStatistics, getBarChartData, getPieChartData, seedDatabase } = require('../controllers/appController');
const router = express.Router();

// Route for listing transactions with search, pagination, and month filtering
router.get('/transactions', listTransactions);

// Route for fetching statistics (total sales, sold items, unsold items)
router.get('/statistics', getStatistics);

// Route for fetching bar chart data (price ranges by month)
router.get('/bar-chart', getBarChartData);

// Route for fetching pie chart data (categories by month)
router.get('/pie-chart', getPieChartData);

// Route for seeding the database with mock data
router.get('/seed', seedDatabase);

module.exports = router;
