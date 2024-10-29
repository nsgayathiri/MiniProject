import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FeesPage.css";
import { backend_path } from "../../constants/backend_path";

const TuitionFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState("full");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [originalTuitionFee] = useState(students.tuition_fees);
  const [hasHalved, setHasHalved] = useState(false);
  const [amountToPay, setPaidAmount] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [paymentAccruedTimes, setPaymentAccruedTimes] = useState(
    students.paymentAccruedTimes || 0
  );
  const navigate = useNavigate();

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };

  const Download_tuition = async () => {
    try {
      const response = await axios.post(
        `${backend_path}/download_receipt`,
        {
          email: students.email,
          amount: amountToPay,
          feestype: "Tuition",
          paymentMode: paymentMode,
          name: students.name,
          admission_no: students.admission_no,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "Tuition_receipt.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  const handleCancel = () => {
    const username = "SsSaDmin153@gmail.com";
    navigate("/admin", { state: { key: username } });
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
        feeType: "tuition_fees",
        date: paymentDate,
        transaction_id: "Cash",
      });

      console.log("Payment details stored successfully");
    } catch (error) {
      console.error("Error storing payment details:", error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await storePaymentDetails();
      await axios.post(`${backend_path}/update-fee-adminpanel`, {
        admission_no: students.admission_no,
        fee_type: "tuition_fees",
        amount: amountToPay,
      });

      setPaymentAccruedTimes(paymentAccruedTimes + 1);
      await Download_tuition();
      const username = "SsSaDmin153@gmail.com";
      navigate("/admin", { state: { key: username } });

      window.history.pushState(null, null, window.location.href);
      window.addEventListener("popstate", function (event) {
        window.history.pushState(null, null, window.location.href);
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <div className="student-details">
        <p>
          <strong>Name:</strong> {students.name}
        </p>
        <p>
          <strong>Reg No:</strong> {students.regno}
        </p>
        <p>
          <strong>Fee Type:</strong> Tuition Fee
        </p>
        <p><strong>Total Amount:</strong> ₹{students.tuition_fees}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="amount-container">
          <label htmlFor="amount-paid">Enter Amount Paying now:</label>
          <input
            type="text"
            id="amount-paid"
            value={amountToPay}
            onChange={(e) => {
              const value = e.target.value;
              setPaidAmount(value === '' ? '' : parseFloat(value) || 0);
            }}
            className="amount-input"
          />
        </div>
        <div>
          <select value={paymentMode} onChange={handlePaymentTypeChange}>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div className="amount-due">
          <p>
            <strong>Amount to Pay:</strong> ₹{amountToPay}
          </p>
        </div>

        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? "Processing..." : "Generate Payment Receipt"}
        </button>
        
        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </form>

      {loading && <p className="loading-indicator">Processing payment, please wait...</p>}
    </div>
  );
};

export default TuitionFeesPage;
