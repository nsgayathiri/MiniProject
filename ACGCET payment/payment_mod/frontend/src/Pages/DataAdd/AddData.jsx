import React, { useState } from 'react';
import './AddData.css';  // Assuming the CSS file is in the same directory
import { backend_path } from '../../constants/backend_path';
const AddData = () => {
  const [formValues, setFormValues] = useState({
    subject_name: '',
    provisional_status: '',
    fees: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      subject_name: formValues.subject_name,
      provisional_status: formValues.provisional_status,
      fees: formValues.fees
    };

    try {
      const response = await fetch(`${backend_path}/add-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.text();
      setResponseMessage(result);
      setFormValues({ subject_name: '', provisional_status: '', fees: '' });  // Reset form after submission
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Error submitting data');
    }
  };

  return (
    <div className="container">
      <h1 className='h1'>Add Data to Database</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject Name:</label>
          <input
            type="text"
            name="subject_name"
            value={formValues.subject_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Provisional Status:</label>
          <input
            type="text"
            name="provisional_status"
            value={formValues.provisional_status}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fees:</label>
          <input
            type="number"
            step="0.01"
            name="fees"
            value={formValues.fees}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddData;

