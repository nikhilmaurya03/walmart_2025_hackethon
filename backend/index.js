const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const alertRoutes = require('./routes/alerts'); // 👈 Import alert route
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const FLASK_API = "http://127.0.0.1:5000";

const Item = require('./models/Item');

// CORS for React frontend
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// === MongoDB API Routes ===
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.set('Cache-Control', 'no-store');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Flask ML API Proxy Routes ===
app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API}/predict`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Error connecting to ML API", details: err.message });
  }
});

// app.post("/api/alerts", async (req, res) => {
//   try {
//     const response = await axios.post(`${FLASK_API}/alerts`, req.body);
//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching alerts", details: err.message });
//   }
// });

app.get("/api/alerts", async (req, res) => {
  try {
    // 1. Fetch items from MongoDB
    const items = await Item.find({});

    // 2. Convert to expected format
    const payload = {
      products: items.map(item => ({
        name: item.name,
        image: item.image,
        category: item.category,
        price: item.price,
        stock: item.stock,
        expiryDate: item.expiry_date, // Make sure Flask handles this key
      })),
    };

    // 3. POST to Flask API
    const response = await axios.post(`${FLASK_API}/alerts`, payload);

    // 4. Return Flask response to frontend
    res.json(response.data);
  } catch (err) {
    console.error("Error in GET /api/alerts:", err.message);
    res.status(500).json({ error: "Error fetching alerts", details: err.message });
  }
});

// === Serve React Frontend from /dist ===
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(alertRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const Item = require('./models/Item');


// app.use(cors({
//   origin: 'http://localhost:5173'
// }));

// app.use(express.json());


// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.error("MongoDB connection error:", err));


// app.get('/items', async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.set('Cache-Control', 'no-store');
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// })
// app.post('/items', async (req, res) => {
//   try {
//     const newItem = new Item(req.body);
//     const savedItem = await newItem.save();
//     res.status(201).json(savedItem);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// app.delete('/items/:id', async (req, res) => {
//   try {
//     const deletedItem = await Item.findByIdAndDelete(req.params.id);
//     if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
//     res.json({ message: 'Item deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// const distPath = path.join(__dirname, '../dist');
// app.use(express.static(distPath));


// app.use((req, res) => {
//   res.sendFile(path.join(distPath, 'index.html'));
// });



// app.listen(PORT, () => {
//   console.log(` Server running at http://localhost:${PORT}`);
// });
