import { useState, useEffect } from 'react';
import { Printer, Clock, CheckCircle, X } from 'lucide-react';
import { customerAPI } from '../services/api';

interface PrintJob {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  measurementType: string;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

const PrintQueue = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrintQueue();
  }, []);

  const loadPrintQueue = async () => {
    try {
      // Load print jobs from localStorage (you can also store in database)
      const stored = localStorage.getItem('oxford-print-queue');
      if (stored) {
        setPrintJobs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading print queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePrintQueue = (jobs: PrintJob[]) => {
    localStorage.setItem('oxford-print-queue', JSON.stringify(jobs));
    setPrintJobs(jobs);
  };

  const updateJobStatus = (jobId: string, status: PrintJob['status']) => {
    const updatedJobs = printJobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            completedAt: status === 'completed' ? new Date().toISOString() : job.completedAt 
          }
        : job
    );
    savePrintQueue(updatedJobs);
  };

  const removeJob = (jobId: string) => {
    const updatedJobs = printJobs.filter(job => job.id !== jobId);
    savePrintQueue(updatedJobs);
  };

  const printMeasurement = async (job: PrintJob) => {
    try {
      updateJobStatus(job.id, 'printing');

      // Get customer details
      const customer = await customerAPI.getById(job.customerId);
      
      // Create print content
      const measurement = customer.measurements?.find((m: any) => m.type === job.measurementType);
      
      const printContent = `
        OXFORD TAILORS - MEASUREMENT CARD
        ================================
        
        Order Number: ${job.orderNumber}
        Customer: ${job.customerName}
        Type: ${job.measurementType.toUpperCase()}
        Date: ${new Date().toLocaleDateString()}
        
        MEASUREMENTS:
        ${measurement ? Object.entries(JSON.parse(measurement.measurements || '{}')).map(([key, value]) => 
          `${key.toUpperCase()}: ${value}`
        ).join('\n') : 'No measurements found'}
        
        NOTES:
        ${measurement?.notes || 'No notes'}
        
        ================================
        Status: ${measurement?.printed ? 'PRINTED' : 'NOT PRINTED'}
      `;

      // Open print dialog
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Measurement Card - ${job.customerName}</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; }
              .measurement-card { border: 2px solid #000; padding: 20px; }
              h1 { text-align: center; margin-bottom: 20px; }
              .field { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="measurement-card">
              <pre>${printContent}</pre>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
        </html>
      `);

      // Update status to completed after delay
      setTimeout(() => {
        updateJobStatus(job.id, 'completed');
      }, 2000);

    } catch (error) {
      console.error('Print error:', error);
      updateJobStatus(job.id, 'failed');
    }
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'printing': return <Printer className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Print Queue</h1>
        <div className="flex space-x-2">
          <button
            onClick={loadPrintQueue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading print queue...</div>
        ) : printJobs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Printer className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No print jobs in queue</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {printJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(job.status)}
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{job.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{job.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{job.measurementType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {job.status === 'pending' && (
                          <button
                            onClick={() => printMeasurement(job)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Print"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Export function to add jobs to print queue
export const addToPrintQueue = (customerId: string, customerName: string, orderNumber: string, measurementType: string) => {
  const stored = localStorage.getItem('oxford-print-queue');
  const currentJobs = stored ? JSON.parse(stored) : [];
  
  const newJob = {
    id: Date.now().toString(),
    customerId,
    customerName,
    orderNumber,
    measurementType,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updatedJobs = [...currentJobs, newJob];
  localStorage.setItem('oxford-print-queue', JSON.stringify(updatedJobs));
  
  // Dispatch event to notify print queue component
  window.dispatchEvent(new Event('printQueueUpdated'));
};

export default PrintQueue;