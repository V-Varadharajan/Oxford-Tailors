const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

    // Create customers table
    console.log('🔄 Creating customers table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NULL,
        address TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created');

    // Create measurements table
    console.log('🔄 Creating measurements table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS measurements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        type ENUM('shirt', 'pant', 'trouser') NOT NULL,
        style ENUM('arrow', 'slack') NULL,
        measurements TEXT NOT NULL,
        notes TEXT,
        printed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Measurements table created');

    // Check if tables have data
    const [customers] = await connection.execute('SELECT COUNT(*) as count FROM customers');
    const customerCount = customers[0].count;
    
    console.log(`📊 Current customers in database: ${customerCount}`);

    if (customerCount === 0) {
      console.log('🔄 Adding sample data...');
      
      // Add sample customers
      const sampleCustomers = [
        {
          order_number: 'ORD-001',
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john.doe@email.com',
          address: '123 Main Street, City, State'
        },
        {
          order_number: 'ORD-002',
          name: 'Jane Smith',
          phone: '+1234567891',
          email: 'jane.smith@email.com',
          address: '456 Oak Avenue, City, State'
        },
        {
          order_number: 'ORD-003',
          name: 'Mike Johnson',
          phone: '+1234567892',
          email: 'mike.johnson@email.com',
          address: '789 Pine Road, City, State'
        }
      ];

      for (const customer of sampleCustomers) {
        const [result] = await connection.execute(
          'INSERT INTO customers (order_number, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
          [customer.order_number, customer.name, customer.phone, customer.email, customer.address]
        );
        
        const customerId = result.insertId;
        
        // Add sample measurements
        const measurements = {
          chest: '40',
          waist: '34',
          hip: '38',
          shoulder: '18',
          sleeve: '24',
          length: '28',
          neck: '16',
          cuff: '9'
        };
        
        await connection.execute(
          'INSERT INTO measurements (customer_id, type, style, measurements, printed) VALUES (?, ?, ?, ?, ?)',
          [customerId, 'shirt', 'arrow', JSON.stringify(measurements), false]
        );
      }
      
      console.log('✅ Sample data added successfully');
    }

    // Display database status
    const [finalCustomers] = await connection.execute('SELECT COUNT(*) as count FROM customers');
    const [finalMeasurements] = await connection.execute('SELECT COUNT(*) as count FROM measurements');
    
    console.log('\n📋 Database Status:');
    console.log(`   Customers: ${finalCustomers[0].count}`);
    console.log(`   Measurements: ${finalMeasurements[0].count}`);
    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 Your Oxford Tailors database is ready to use!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 Database connection closed');
    }
  }
}

// Run setup
setupDatabase();