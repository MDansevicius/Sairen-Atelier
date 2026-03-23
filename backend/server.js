const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a product
app.post('/api/products', async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/checkout/create-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in backend environment.',
    });
  }

  const { items, origin } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  const normalizedItems = items
    .filter((item) => item && item.name && Number(item.priceCents) > 0 && Number(item.quantity) > 0)
    .map((item) => ({
      name: String(item.name),
      quantity: Number(item.quantity),
      priceCents: Number(item.priceCents),
      image: item.image ? String(item.image) : null,
    }));

  if (normalizedItems.length === 0) {
    return res.status(400).json({ error: 'No valid cart items.' });
  }

  try {
    const baseUrl = typeof origin === 'string' && origin.startsWith('http')
      ? origin
      : process.env.CHECKOUT_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: normalizedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: item.priceCents,
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
        },
      })),
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        source: 'sairen-web',
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

app.get('/api/checkout/session/:id', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in backend environment.',
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    return res.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      amountTotal: session.amount_total || null,
      currency: session.currency || 'eur',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve checkout session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});