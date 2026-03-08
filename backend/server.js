const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  // Placeholder for products
  res.json([{ id: 1, name: 'Sample Product', price: 10.99 }]);
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});