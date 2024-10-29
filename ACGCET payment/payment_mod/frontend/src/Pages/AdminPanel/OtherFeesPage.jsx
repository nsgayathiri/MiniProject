import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';
import { backend_path } from '../../constants/backend_path';

function OtherFeesPage() {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full');
  const [amountToPay, setAmountToPay] = useState(students.otherFees);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.miscellaneous_fees);
  }, [paymentType, students.miscellaneous_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };

  const Download_Others = async () => {
    try {
      const response = await axios.post(
        `${backend_path}/download_receipt`,
        {
          email: students.email,
          amount: students.miscellaneous_fees,
          feestype: 'miscellaneous_fees',
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
      a.setAttribute('download', 'Others_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin',{state:{key:username}});
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
        feeType: 'Miscellaneous Fee',
        date: paymentDate
      });
      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };
  const username = "SsSaDmin153@gmail.com";
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await storePaymentDetails();
      await axios.post(`${backend_path}/studentfee`, {
        email: students.email,
        ...students,
        miscellaneous_fees: 0,
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_Others();
      
      navigate('/admin', {
        state: { key: username },
        replace: true,
      });

      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, null, window.location.href);
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="student-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Miscellaneous Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.miscellaneous_fees}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? 'Processing Payment...' : 'Generate Payment Receipt'}
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default OtherFeesPage;
