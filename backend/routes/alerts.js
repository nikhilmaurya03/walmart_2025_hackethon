// routes/alerts.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // ✅ Your Mongoose model
const moment = require('moment');

router.get('/api/alerts', async (req, res) => {
  try {
    const items = await Item.find({}); // Fetch from 'products' collection
    const today = moment();
    const alerts = [];

    items.forEach(item => {
      const daysLeft = moment(item.expiry_date).diff(today, 'days');

      if (daysLeft <= 7) {
        alerts.push({
          productName: item.name,
          category: item.category,
          type: 'Near Expiry',
          message: `Expires in ${daysLeft} days`,
        });
      }

      if (item.stock > 1500) {
        alerts.push({
          productName: item.name,
          category: item.category,
          type: 'Excess Stock',
          message: `Stock is high: ${item.stock} units`,
        });
      }
    });
   console.log("🚀 Alerts generated:", alerts);
    res.json(alerts); // return array
  } catch (err) {
    console.error("Error generating alerts:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
