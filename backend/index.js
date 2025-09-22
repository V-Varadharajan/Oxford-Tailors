const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['https://varadharajan-tailoring-app.web.app', 'https://varadharajan-tailoring-app.firebaseapp.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12799628',
  password: process.env.DB_PASSWORD || 'GUw4wuhJgJ',
  database: process.env.DB_NAME || 'sql12799628',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
};

let pool;

// Initialize database connection
async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Oxford Tailors API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { order_number, name, phone, email, address } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO customers (order_number, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [order_number, name, phone, email, address]
    );
    
    const [newCustomer] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newCustomer[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Order number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_number, name, phone, email, address } = req.body;
    
    await pool.execute(
      'UPDATE customers SET order_number = ?, name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [order_number, name, phone, email, address, id]
    );
    
    const [updatedCustomer] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    
    res.json(updatedCustomer[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Get measurements for a customer
app.get('/api/measurements/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM measurements WHERE customer_id = ?',
      [customerId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// Add measurements
app.post('/api/measurements', async (req, res) => {
  try {
    const { customer_id, type, style, measurements, notes } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO measurements (customer_id, type, style, measurements, notes) VALUES (?, ?, ?, ?, ?)',
      [customer_id, type, style, JSON.stringify(measurements), notes]
    );
    
    const [newMeasurement] = await pool.execute(
      'SELECT * FROM measurements WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newMeasurement[0]);
  } catch (error) {
    console.error('Error adding measurements:', error);
    res.status(500).json({ error: 'Failed to add measurements' });
  }
});

// Initialize database when function starts
initDatabase().catch(console.error);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);