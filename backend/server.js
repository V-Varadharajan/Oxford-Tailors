const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

let db;

// Initialize database connection
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// API Routes

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const [customers] = await db.execute(`
      SELECT c.* FROM customers c
      ORDER BY c.created_at DESC
    `);
    
    // Get measurements for each customer
    for (let customer of customers) {
      const [measurements] = await db.execute(
        'SELECT type, printed FROM measurements WHERE customer_id = ?',
        [customer.id]
      );
      customer.measurements = measurements;
    }
    
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
app.get('/api/customers/:id', async (req, res) => {
  try {
    const [customers] = await db.execute(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const [measurements] = await db.execute(
      'SELECT * FROM measurements WHERE customer_id = ?',
      [req.params.id]
    );
    
    res.json({
      ...customers[0],
      measurements: measurements
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { order_number, name, phone, measurements = [] } = req.body;
    
    // Insert customer
    const [result] = await db.execute(
      'INSERT INTO customers (order_number, name, phone) VALUES (?, ?, ?)',
      [order_number, name, phone]
    );
    
    const customerId = result.insertId;
    
    // Insert measurements if provided
    for (const measurement of measurements) {
      await db.execute(
        'INSERT INTO measurements (customer_id, type, style, measurements, notes, printed) VALUES (?, ?, ?, ?, ?, ?)',
        [customerId, measurement.type, measurement.style || null, JSON.stringify(measurement.measurements || {}), measurement.notes || null, measurement.printed || false]
      );
    }
    
    res.status(201).json({
      id: customerId,
      order_number,
      name,
      phone,
      measurements,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, phone, order_number } = req.body;
    
    await db.execute(
      'UPDATE customers SET name = ?, phone = ?, order_number = ?, updated_at = NOW() WHERE id = ?',
      [name, phone, order_number, req.params.id]
    );
    
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer();