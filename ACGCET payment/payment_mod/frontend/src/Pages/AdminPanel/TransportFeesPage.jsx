import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';
import { backend_path } from '../../constants/backend_path';

const TransportFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full');
  const [amountToPay, setAmountToPay] = useState(students.transport_fees || 0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.transport_fees || 0);
  }, [paymentType, students.transport_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const Download_transport = async () => {
    try {
      const response = await axios.post(
        `${backend_path}/download_receipt`,
        {
          email: students.email,
          amount: students.transport_fees,
          feestype: 'Transport',
          paymentMode,
          name: students.name,
          admission_no: students.admission_no,
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'Transport_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };

  const storePaymentDetails = async () => {
    const paymentDate = new Date().toISOString().slice(0, 10);
    try {
      await axios.post(`${backend_path}/storePaymentDetails`, {
        name: students.name,
        email: students.email,
        admission_no: students.admission_no,
        regno: students.regno,
        amount: amountToPay,
        phone_no: students.phone_no,
        payment_mode: paymentMode,
        feeType: 'Transport Fee',
        date: paymentDate,
      });

      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await storePaymentDetails();
      await axios.post(`${backend_path}/studentfee`, {
        email: students.email,
        ...students,
        transport_fees: 0,
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_transport();
      
      const username = "SsSaDmin153@gmail.com";
      navigate('/admin', { state: { key: username }, replace: true });
    } catch (error) {
      console.error('Error processing payment:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="students-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Transport Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.transport_fees || 0}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Type:</label>
          <select value={paymentType} onChange={handlePaymentTypeChange}>
            <option value="full">Full Payment</option>
          </select>
        </div>
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? 'Processing...' : 'Generate Payment Receipt'}
        </button>
        <button type="button" className="cancel-button" onClick={() => navigate('/admin',{state:{key:"SsSaDmin153@gmail.com"}})}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TransportFeesPage;
