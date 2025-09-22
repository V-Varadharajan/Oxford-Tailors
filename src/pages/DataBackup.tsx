import { useState } from 'react';
import { Download, FileText, Database, AlertTriangle } from 'lucide-react';
import { customerAPI } from '../services/api';

const DataBackup = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Export customer data as Excel (CSV format)
  const exportToExcel = async () => {
    try {
      setLoading(true);
      const customers = await customerAPI.getAll();
      
      // Create CSV content
      const csvHeader = 'Order Number,Name,Phone,Email,Address,Chest,Waist,Hip,Shoulder,Sleeve,Length,Inseam,Created Date\n';
      const csvContent = customers.map((customer: any) => {
        const measurements = customer.measurements || {};
        return [
          customer.order_number || '',
          customer.name || '',
          customer.phone || '',
          customer.email || '',
          customer.address || '',
          measurements.chest || '',
          measurements.waist || '',
          measurements.hip || '',
          measurements.shoulder || '',
          measurements.sleeve || '',
          measurements.length || '',
          measurements.inseam || '',
          new Date(customer.created_at).toLocaleDateString()
        ].map(field => `"${field}"`).join(',');
      }).join('\n');

      const blob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `oxford-tailors-customers-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      showMessage('success', 'Customer data exported to Excel format successfully!');
    } catch (error) {
      console.error('Export to Excel failed:', error);
      showMessage('error', 'Failed to export data to Excel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export customer data as PDF (simplified format)
  const exportToPDF = async () => {
    try {
      setLoading(true);
      const customers = await customerAPI.getAll();
      
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Oxford Tailors - Customer List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2563eb; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .customer { 
              border: 1px solid #ddd; 
              margin: 15px 0; 
              padding: 15px; 
              border-radius: 5px;
              page-break-inside: avoid;
            }
            .customer-header { 
              background: #f8f9fa; 
              padding: 10px; 
              margin: -15px -15px 15px -15px; 
              border-radius: 5px 5px 0 0;
              border-bottom: 1px solid #ddd;
            }
            .customer-name { font-size: 18px; font-weight: bold; color: #2563eb; }
            .order-number { color: #666; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { margin: 5px 0; }
            .label { font-weight: bold; color: #374151; }
            .measurements { 
              background: #f9fafb; 
              padding: 10px; 
              border-radius: 5px; 
              margin-top: 10px;
            }
            .measurements-grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 8px; 
            }
            @media print {
              body { margin: 10px; }
              .customer { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Oxford Tailors</h1>
            <p>Customer Database Report</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Customers: ${customers.length}</p>
          </div>
          
          ${customers.map((customer: any) => {
            const measurements = customer.measurements || {};
            return `
              <div class="customer">
                <div class="customer-header">
                  <div class="customer-name">${customer.name}</div>
                  <div class="order-number">Order #${customer.order_number || 'N/A'}</div>
                </div>
                
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Phone:</span> ${customer.phone || 'N/A'}
                  </div>
                  <div class="info-item">
                    <span class="label">Email:</span> ${customer.email || 'N/A'}
                  </div>
                </div>
                
                <div class="info-item">
                  <span class="label">Address:</span> ${customer.address || 'N/A'}
                </div>
                
                <div class="measurements">
                  <div class="label" style="margin-bottom: 10px;">Measurements:</div>
                  <div class="measurements-grid">
                    <div><strong>Chest:</strong> ${measurements.chest || 'N/A'}</div>
                    <div><strong>Waist:</strong> ${measurements.waist || 'N/A'}</div>
                    <div><strong>Hip:</strong> ${measurements.hip || 'N/A'}</div>
                    <div><strong>Shoulder:</strong> ${measurements.shoulder || 'N/A'}</div>
                    <div><strong>Sleeve:</strong> ${measurements.sleeve || 'N/A'}</div>
                    <div><strong>Length:</strong> ${measurements.length || 'N/A'}</div>
                    <div><strong>Inseam:</strong> ${measurements.inseam || 'N/A'}</div>
                    <div><strong>Added:</strong> ${new Date(customer.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </body>
        </html>
      `;

      // Open in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Trigger print dialog after content loads
        printWindow.onload = () => {
          printWindow.print();
        };
        
        showMessage('success', 'PDF preview opened! Use your browser\'s print function to save as PDF.');
      } else {
        showMessage('error', 'Pop-up blocked. Please allow pop-ups and try again.');
      }
    } catch (error) {
      console.error('Export to PDF failed:', error);
      showMessage('error', 'Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Database className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Export</h1>
            <p className="text-gray-600">Export your customer data in PDF or Excel format</p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <AlertTriangle className="h-5 w-5 mr-2" />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Excel Export */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Excel Export</h3>
                <p className="text-sm text-gray-600">Download as spreadsheet (.csv)</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700 mb-4">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                All customer information and measurements
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Easy to open in Excel or Google Sheets
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Perfect for data analysis and calculations
              </div>
            </div>

            <button
              onClick={exportToExcel}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              {loading ? 'Exporting...' : 'Export to Excel'}
            </button>
          </div>

          {/* PDF Export */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">PDF Export</h3>
                <p className="text-sm text-gray-600">Generate printable report</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700 mb-4">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Professional formatted customer cards
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Ready for printing or digital sharing
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Complete measurement details included
              </div>
            </div>

            <button
              onClick={exportToPDF}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              {loading ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Excel Export:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Export to Excel" button</li>
                <li>File will download automatically</li>
                <li>Open with Excel, Google Sheets, or any spreadsheet app</li>
                <li>Use for calculations, sorting, and data analysis</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">PDF Export:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Generate PDF" button</li>
                <li>New window opens with formatted report</li>
                <li>Use browser's print function</li>
                <li>Choose "Save as PDF" in print dialog</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackup;