// ExamFeeTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamFeeTransactions.css'; 
import { backend_path } from '../../../constants/backend_path';
const ExamFeeTable = () => {
  const [examFees, setExamFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend_path}/examfee/transactions`);
        setExamFees(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <h1 className="header">Exam Fee Transactions</h1>
      <table className="examfee-table">
        <thead>
          <tr className="table-header">
            <th className="table-header-cell">Bill No</th>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Reg No</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Type</th>
            <th className="table-header-cell">Mode</th>
            <th className="table-header-cell">Amount</th>
            <th className="table-header-cell">No of Subjects</th>
            <th className="table-header-cell">Transaction ID</th>
            <th className="table-header-cell">Transaction Date</th>
            <th className="table-header-cell">Transaction Time</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {examFees.map(fee => (
            <tr key={fee.billno} className="table-row">
              <td className="table-cell" data-label="Bill No">{fee.billno}</td>
              <td className="table-cell" data-label="Name">{fee.name}</td>
              <td className="table-cell" data-label="Reg No">{fee.regno}</td>
              <td className="table-cell" data-label="Email">{fee.email}</td>
              <td className="table-cell" data-label="Type">{fee.type}</td>
              <td className="table-cell" data-label="Mode">{fee.mode}</td>
              <td className="table-cell" data-label="Amount">{fee.amount}</td>
              <td className="table-cell" data-label="No of Subjects">{fee.no_of_subjects}</td>
              <td className="table-cell" data-label="Transaction ID">{fee.transaction_id}</td>
              <td className="table-cell" data-label="Transaction Date">{fee.transaction_date}</td>
              <td className="table-cell" data-label="Transaction Time">{fee.transaction_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamFeeTable;
