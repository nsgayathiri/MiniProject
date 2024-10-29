import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';
import { backend_path } from '../../constants/backend_path';

const CautionDeposit = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.caution_deposit);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const username="SsSaDmin153@gmail.com"
  useEffect(() => {
    setAmountToPay(students.caution_deposit);
  }, [paymentType, students.caution_deposit]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
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
        feeType: 'Caution Deposit',
        date: paymentDate
      });
      
      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };



  const Download_cautionDeposit = async () => {
    try {
      const response = await axios.post(
        `${backend_path}/download_receipt`,
        {
          email: students.email,
          amount: students.caution_deposit,
          feestype: 'CautionDeposit',
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
      a.setAttribute('download', 'CD_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      await storePaymentDetails();
      await axios.post(`${backend_path}/studentfee`, {
        email: students.email,
        ...students,
        caution_deposit: 0,
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_cautionDeposit();

      const username = "SsSaDmin153@gmail.com";
      navigate('/admin', { state: { key: username }, replace: true });

      // Prevent back navigation
      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', function(event) {
        window.history.pushState(null, null, window.location.href);
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  const handleCancel = () => {
    navigate('/admin',{state: {key: username}});
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="students-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Caution Deposit (Refundable)</p>
        <p><strong>Total Amount:</strong> ₹{students.caution_deposit}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button" disabled={isLoading}>
          {isLoading ? 'Generating Receipt...' : 'Generate Payment Receipt'}
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default CautionDeposit;
