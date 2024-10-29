import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';
import { backend_path } from '../../constants/backend_path';

const RegistrationFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.reg_fees);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.reg_fees);
  }, [paymentType, students.reg_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };

  const Download_registration = async () => {
    try {
      const response = await axios.post(
        `${backend_path}/download_receipt`,
        {
          email: students.email,
          amount: students.reg_fees,
          feestype: 'Registration',
          paymentMode: paymentMode,
          name: students.name,
          admission_no: students.admission_no,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'Registration_receipt.pdf');
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
        feeType: 'Registration Fee',
        date: paymentDate
      });
      
      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await storePaymentDetails();
      await axios.post(`${backend_path}/studentfee`, {
        email: students.email,
        ...students,
        reg_fees: 0,
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_registration();

      navigate('/admin', {
        state: { key: "SsSaDmin153@gmail.com" },
        replace: true,
      });

      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', function(event) {
        window.history.pushState(null, null, window.location.href);
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin',{state:{key:"SsSaDmin153@gmail.com"}});
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="students-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Registration Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.reg_fees}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? 'Processing...' : 'Generate Payment Receipt'}
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RegistrationFeesPage;
