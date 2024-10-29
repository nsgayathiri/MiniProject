import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";
import { backend_path } from "../../constants/backend_path";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [sortedHistory, setSortedHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { key } = location.state || {};

  useEffect(() => {
    if (!key && key !== "SsSaDmin153@gmail.com") {
      navigate('/');
    }

    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.post(`${backend_path}/payment-history`);
        setPaymentHistory(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };
    fetchPaymentHistory();
  }, []);

  const [pendingTransactionCount, setPendingTransactionCount] = useState(0);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const response = await axios.get(`${backend_path}/pending-transactions-count`);
        setPendingTransactionCount(response.data.count);
      } catch (error) {
        console.error("Error fetching pending transactions count:", error);
      }
    };
    fetchPendingTransactions();
  }, []);

  // Toggle sorting functionality
  const toggleSortByDate = () => {
    setIsSorted(!isSorted);
    if (!isSorted) {
      const groupedByDate = paymentHistory.reduce((acc, payment) => {
        const date = new Date(payment.payment_date).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(payment);
        return acc;
      }, {});
      setSortedHistory(groupedByDate);
    }
  };

  return (
    <div className="payment-history-container">
      <div className="admin-panel">
        <h1 className="h1">Payment History</h1>
        <div className="button-container">
          <button
            className="history-button"
            onClick={() => navigate("/admin", { state: { key } })}
          >
            Admin Panel
          </button>
          <button
            className="history-button"
            onClick={() => navigate("/payment-request", { state: { key } })}
          >
            Payment Requests
            {pendingTransactionCount > 0 && (
              <span className="notification-badge">{pendingTransactionCount}</span>
            )}
          </button>
          <button
            className="history-button"
            onClick={toggleSortByDate}
          >
            {isSorted ? "Show Original Order" : "Sort by Date"}
          </button>
        </div>
        
        <div className="content-container">
          <div className="table-container">
            {isSorted ? (
              Object.keys(sortedHistory).map(date => (
                <div key={date} className="date-group">
                  <h2>{date}</h2>
                  <table className="table">
                    <thead>
                      <tr className="tr">
                        <th className="th">Receipt Number</th>
                        <th className="th">Admission Number</th>
                        <th className="th">Reg No</th>
                        <th className="th">Name</th>
                        <th className="th">Email</th>
                        <th className="th">Phone No</th>
                        <th className="th">Online/Offline</th>
                        <th className="th">Transaction ID</th>
                        <th className="th">Payment Date</th>
                        <th className="th">Fee Type</th>
                        <th className="th">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedHistory[date].map((payment, index) => (
                        <tr key={index} className="tr">
                          <td className="td">{payment.receipt_no}</td>
                          <td className="td">{payment.admission_number}</td>
                          <td className="td">{payment.regno}</td>
                          <td className="td">{payment.name}</td>
                          <td className="td">{payment.email}</td>
                          <td className="td">{payment.phone_no}</td>
                          <td className="td">{payment.payment_mode}</td>
                          <td className="td">{payment.transaction_id}</td>
                          <td className="td">{new Date(payment.payment_date).toLocaleDateString()}</td>
                          <td className="td">{payment.fee_type}</td>
                          <td className="td">₹{payment.amount_paid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <table className="table">
                <thead>
                  <tr className="tr">
                    <th className="th">Receipt Number</th>
                    <th className="th">Admission Number</th>
                    <th className="th">Reg No</th>
                    <th className="th">Name</th>
                    <th className="th">Email</th>
                    <th className="th">Phone No</th>
                    <th className="th">Online/Offline</th>
                    <th className="th">Transaction ID</th>
                    <th className="th">Payment Date</th>
                    <th className="th">Fee Type</th>
                    <th className="th">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length ? (
                    paymentHistory.map((payment, index) => (
                      <tr key={index} className="tr">
                        <td className="td">{payment.receipt_no}</td>
                        <td className="td">{payment.admission_number}</td>
                        <td className="td">{payment.regno}</td>
                        <td className="td">{payment.name}</td>
                        <td className="td">{payment.email}</td>
                        <td className="td">{payment.phone_no}</td>
                        <td className="td">{payment.payment_mode}</td>
                        <td className="td">{payment.transaction_id}</td>
                        <td className="td">{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td className="td">{payment.fee_type}</td>
                        <td className="td">₹{payment.amount_paid}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-data">
                        No payment history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
