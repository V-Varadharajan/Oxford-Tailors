# 🎯 Oxford Tailors - Customer Management System

> Professional customer management system for tailoring businesses with modern web technologies.

## ✨ Features

- **👥 Customer Management** - Add, edit, and manage customer information
- **📏 Measurements Tracking** - Store detailed measurements for shirts, pants, and trousers  
- **🔢 Auto Order Numbers** - Sequential order numbering (ORD-001, ORD-002, etc.)
- **🖨️ Print Queue** - Track orders ready for printing
- **💾 Data Export** - Backup customer data to PDF and Excel
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🎨 Professional Branding** - Clean, modern interface with custom logo

## 🚀 Live Demo

**Application**: [https://varadharajan-tailoring-app.web.app](https://varadharajan-tailoring-app.web.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MySQL** database (FreeSQLDatabase.com)
- **CORS** enabled for cross-origin requests
- **Environment variables** for configuration

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MySQL database (or use FreeSQLDatabase.com)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd oxford-tailors
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # In backend folder, create .env file:
   DB_HOST=sql12.freesqldatabase.com
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_PORT=3306
   PORT=3001
   ```

5. **Setup database**
   ```bash
   cd backend
   node setup-database.js
   ```

6. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd ..
   npm run dev
   ```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-backend-url/api`

### Endpoints

#### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

#### Measurements
- `GET /measurements/:customerId` - Get customer measurements
- `POST /measurements` - Add measurements

## 📄 License

This project is developed for Oxford Tailors. All rights reserved.

**Your Oxford Tailors application is ready to go live! 🎉**
