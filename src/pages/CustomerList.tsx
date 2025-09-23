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
      await customerAPI.delete(id);
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer. Please try again.');
    }
  };

  const handlePrint = (customer: Customer) => {
    const printContent = `
Customer Details:
Order Number: ${customer.order_number}
Name: ${customer.name}
Phone: ${customer.phone}
Email: ${customer.email || 'N/A'}
Address: ${customer.address || 'N/A'}
`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Customer Details</title></head>
          <body>
            <pre>${printContent}</pre>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Customers</h1>
        <Link
          to="/customers/add"
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, phone, or order number..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p className="mb-2">{error}</p>
            <button 
              onClick={fetchCustomers}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
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
                    <tr key={customer.id} className="hover:bg-gray-50">
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
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="Edit Customer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handlePrint(customer)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Print Customer Details"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id!)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{customer.order_number}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/customers/edit/${customer.id}`}
                        className="text-blue-600 hover:text-blue-800 p-2 bg-white rounded-full shadow-sm"
                        title="Edit Customer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handlePrint(customer)}
                        className="text-green-600 hover:text-green-800 p-2 bg-white rounded-full shadow-sm"
                        title="Print Customer Details"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id!)}
                        className="text-red-600 hover:text-red-800 p-2 bg-white rounded-full shadow-sm"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium w-16">Phone:</span>
                      <span>{customer.phone}</span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center">
                        <span className="font-medium w-16">Email:</span>
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.created_at && (
                      <div className="flex items-center">
                        <span className="font-medium w-16">Date:</span>
                        <span>{new Date(customer.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
