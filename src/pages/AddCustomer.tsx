import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Printer, RefreshCw } from 'lucide-react';
import { customerAPI } from '../services/api';

interface MeasurementFields {
  shirt?: {
    style: 'arrow' | 'slack';
    length: string;
    chest: string;
    waist: string;
    hip: string;
    shoulder: string;
    sleeve: string;
    neck: string;
    cuff: string;
    notes?: string;
  };
  pant?: {
    length: string;
    waist: string;
    hip: string;
    thigh: string;
    knee: string;
    bottom: string;
    fork: string;
    notes?: string;
  };
  trouser?: {
    length: string;
    waist: string;
    hip: string;
    thigh: string;
    bottom: string;
    fork: string;
    notes?: string;
  };
}

const AddCustomer = () => {
  const navigate = useNavigate();
  const [measurementTypes, setMeasurementTypes] = useState({
    shirt: false,
    pant: false,
    trouser: false,
  });

  const [formData, setFormData] = useState({
    orderNumber: '',
    name: '',
    phone: '',
  });

  const [measurements, setMeasurements] = useState<MeasurementFields>({});
  const [shirtStyle, setShirtStyle] = useState<'arrow' | 'slack'>('arrow');

  // Generate next order number in sequence
  const generateNextOrderNumber = async () => {
    try {
      const customers = await customerAPI.getAll();
      
      // Extract all existing order numbers and convert to numbers
      const existingNumbers = customers
        .map((customer: any) => customer.order_number)
        .filter((orderNum: any) => orderNum && orderNum.startsWith('ORD-'))
        .map((orderNum: any) => {
          const match = orderNum.match(/ORD-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((num: any) => !isNaN(num) && num > 0)
        .sort((a: any, b: any) => a - b); // Sort in ascending order
      
      // Find the next number in sequence
      let nextNumber = 1;
      for (let i = 0; i < existingNumbers.length; i++) {
        if (existingNumbers[i] === nextNumber) {
          nextNumber++;
        } else {
          break; // Found a gap, use this number
        }
      }
      
      return `ORD-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating order number:', error);
      // Fallback to ORD-001 if API fails
      return 'ORD-001';
    }
  };

  // Auto-generate order number on component mount
  useEffect(() => {
    const initializeOrderNumber = async () => {
      if (!formData.orderNumber) {
        const nextOrderNumber = await generateNextOrderNumber();
        setFormData(prev => ({ ...prev, orderNumber: nextOrderNumber }));
      }
    };
    initializeOrderNumber();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare customer data
      const customerData = {
        order_number: formData.orderNumber,
        name: formData.name,
        phone: formData.phone,
        measurements: Object.entries(measurements).map(([type, data]) => ({
          type,
          style: type === 'shirt' ? shirtStyle : null,
          measurements: data,
          printed: false
        }))
      };

      // Save to database via API
      await customerAPI.create(customerData);
      
      // Notify CustomerList to refresh
      window.dispatchEvent(new Event('customerAdded'));
      
      // Navigate back to customers list
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    }
  };

  const handleMeasurementChange = (type: keyof MeasurementFields, field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const renderMeasurementFields = (type: keyof MeasurementFields) => {
    const fields = {
      shirt: [
        { name: 'length', label: 'Length' },
        { name: 'chest', label: 'Chest' },
        { name: 'waist', label: 'Waist' },
        { name: 'hip', label: 'Hip' },
        { name: 'shoulder', label: 'Shoulder' },
        { name: 'sleeve', label: 'Sleeve' },
        { name: 'neck', label: 'Neck' },
        { name: 'cuff', label: 'Cuff' },
      ],
      pant: [
        { name: 'length', label: 'Length' },
        { name: 'waist', label: 'Waist' },
        { name: 'hip', label: 'Hip' },
        { name: 'thigh', label: 'Thigh' },
        { name: 'knee', label: 'Knee' },
        { name: 'bottom', label: 'Bottom' },
        { name: 'fork', label: 'Fork' },
      ],
      trouser: [
        { name: 'length', label: 'Length' },
        { name: 'waist', label: 'Waist' },
        { name: 'hip', label: 'Hip' },
        { name: 'thigh', label: 'Thigh' },
        { name: 'bottom', label: 'Bottom' },
        { name: 'fork', label: 'Fork' },
      ],
    };

    return (
      <div className="space-y-4">
        {type === 'shirt' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={shirtStyle === 'arrow'}
                  onChange={() => setShirtStyle('arrow')}
                />
                <span className="ml-2">Arrow</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={shirtStyle === 'slack'}
                  onChange={() => setShirtStyle('slack')}
                />
                <span className="ml-2">Slack</span>
              </label>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {fields[type].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={(measurements[type] as any)?.[field.name] || ''}
                onChange={(e) => handleMeasurementChange(type, field.name, e.target.value)}
              />
            </div>
          ))}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            value={measurements[type]?.notes || ''}
            onChange={(e) => handleMeasurementChange(type, 'notes', e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Customer</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                placeholder="e.g., ORD-001"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              />
              <button
                type="button"
                onClick={async () => {
                  const nextOrderNumber = await generateNextOrderNumber();
                  setFormData(prev => ({ ...prev, orderNumber: nextOrderNumber }));
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-1"
                title="Generate next order number"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Next</span>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Order numbers are automatically assigned (ORD-001, ORD-002, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement Types
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={measurementTypes.shirt}
                  onChange={(e) =>
                    setMeasurementTypes({ ...measurementTypes, shirt: e.target.checked })
                  }
                />
                <span className="ml-2">Shirt</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={measurementTypes.pant}
                  onChange={(e) =>
                    setMeasurementTypes({ ...measurementTypes, pant: e.target.checked })
                  }
                />
                <span className="ml-2">Pant</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={measurementTypes.trouser}
                  onChange={(e) =>
                    setMeasurementTypes({ ...measurementTypes, trouser: e.target.checked })
                  }
                />
                <span className="ml-2">Trouser</span>
              </label>
            </div>
          </div>

          {measurementTypes.shirt && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Shirt Measurements</h2>
              {renderMeasurementFields('shirt')}
            </div>
          )}

          {measurementTypes.pant && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Pant Measurements</h2>
              {renderMeasurementFields('pant')}
            </div>
          )}

          {measurementTypes.trouser && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Trouser Measurements</h2>
              {renderMeasurementFields('trouser')}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              onClick={() => {

              }}
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Measurements
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Customer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;