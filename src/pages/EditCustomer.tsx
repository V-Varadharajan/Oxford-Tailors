import React from 'react';
import { useParams } from 'react-router-dom';

const EditCustomer = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Customer</h1>
      {/* TODO: Implement edit form similar to AddCustomer */}
    </div>
  );
};

export default EditCustomer;