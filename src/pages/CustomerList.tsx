import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit2, Trash2, Printer } from 'lucide-react';
import { customerAPI, Customer } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch data from API
      const customersData = await customerAPI.getAll();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      // Delete via API
      await customerAPI.delete(id);
      
      // Remove from local state
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer. Please try again.');
    }
  };

  const handlePrint = (customer: Customer) => {
    // Basic print functionality - you can enhance this based on your needs
    const printContent = `
      Customer Details:
      Order Number: ${customer.order_number}
      Name: ${customer.name}
      Phone: ${customer.phone}
      Date: ${customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
      
      Measurements: ${customer.measurements?.length || 0} items
    `;
    
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow?.document.write(`
      <html>
        <head><title>Customer Details - ${customer.name}</title></head>
        <body>
          <pre>${printContent}</pre>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  // Export function to refresh customers (for use by AddCustomer component)
  const refreshCustomers = () => {
    fetchCustomers();
  };

  // Listen for custom events to refresh data
  useEffect(() => {
    const handleCustomerAdded = () => {
      refreshCustomers();
    };

    window.addEventListener('customerAdded', handleCustomerAdded);
    
    return () => {
      window.removeEventListener('customerAdded', handleCustomerAdded);
    };
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <Link
          to="/customers/add"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, phone, or order number..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading customers...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              {error}
              <button 
                onClick={fetchCustomers}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          to={`/customers/edit/${customer.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => customer.id && handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handlePrint(customer)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </div>
  </div>
  );
};

export default CustomerList;