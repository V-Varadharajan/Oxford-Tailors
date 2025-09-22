import { Link } from 'react-router-dom';
import { Users, PlusCircle, Printer, Database, Star } from 'lucide-react';
import Logo from '../components/Logo';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center mb-4">
          <Logo size="lg" showText={true} variant="white" className="mr-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 mr-2 text-yellow-300" />
              <h3 className="font-semibold">Customer Management</h3>
            </div>
            <p className="text-sm text-blue-100">Store customer details, measurements, and order history in a secure cloud database</p>
          </div>
          
          <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Printer className="h-5 w-5 mr-2 text-yellow-300" />
              <h3 className="font-semibold">Print Management</h3>
            </div>
            <p className="text-sm text-blue-100">Queue and manage measurement card printing with priority tracking</p>
          </div>
          
          <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 mr-2 text-yellow-300" />
              <h3 className="font-semibold">Data Export</h3>
            </div>
            <p className="text-sm text-blue-100">Export customer data to PDF reports or Excel spreadsheets for analysis</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/customers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800 ml-3">View Customers</h2>
          </div>
          <p className="mt-2 text-gray-600">Browse and manage your customer list</p>
        </Link>

        <Link
          to="/customers/add"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <PlusCircle className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Add Customer</h2>
          </div>
          <p className="mt-2 text-gray-600">Create a new customer record</p>
        </Link>

        <Link
          to="/print-queue"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <Printer className="h-8 w-8 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Print Queue</h2>
          </div>
          <p className="mt-2 text-gray-600">Manage measurement card printing jobs</p>
        </Link>

        <Link
          to="/backup"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <Database className="h-8 w-8 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-800 ml-3">Data Export</h2>
          </div>
          <p className="mt-2 text-gray-600">Export customer data to PDF or Excel</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;