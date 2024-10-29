import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ProvisionalPage.css';
import { backend_path } from '../../../constants/backend_path';
function ProvisionalPage() {
    const location = useLocation();
    const students = location.state?.students || {};
    const [provisionalStatus, setProvisionalStatus] = useState('first');
    const [subjects, setSubjects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('offline');
    const [transactionId, setTransactionId] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [amountToPay, setAmountToPay] = useState(0);
    const [error, setError] = useState(''); // For error messages

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProvisionalSubjects = async () => {
            try {
                const response = await axios.get(`${backend_path}/subjects?provisional=${provisionalStatus}`);
                const fetchedSubjects = response.data.map(subject => ({
                    ...subject,
                    fee_amount: parseFloat(subject.fee_amount)
                }));
                setSubjects(fetchedSubjects);
                const total = fetchedSubjects.reduce((sum, sub) => sum + sub.fee_amount, 0);
                setTotalAmount(total);
                setAmountToPay(total);
            } catch (error) {
                console.error('Error fetching provisional subjects', error.response?.data || error.message);
            }
        };

        fetchProvisionalSubjects();
    }, [provisionalStatus]);

    const handleProvisionalChange = (event) => {
        setProvisionalStatus(event.target.value);
    };

    const handlePaymentModeChange = (event) => {
        setPaymentMode(event.target.value);
    };

    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
    };

    const handleTransactionDateChange = (event) => {
        setTransactionDate(event.target.value);
    };

    const handleTransactionTimeChange = (event) => {
        setTransactionTime(event.target.value);
    };

    const storeExamFeeTransactions = async () => {
        try {
            await axios.post(`${backend_path}/examfee/record`, {
                name: students.name,
                regno: students.regno,
                email: students.email,
                type: 'regular',
                mode: paymentMode,
                amount: amountToPay,
                no_of_subjects: subjects.length,
                transaction_id: paymentMode === 'online' ? transactionId : 'cash',
                transaction_date: transactionDate,
                transaction_time: transactionTime
            });
            console.log('Payment details stored successfully');
        } catch (error) {
            console.error('Error storing payment details:', error);
        }
    };

    const updateAdminPanel = async () => {
        try {
            await axios.patch(`${backend_path}/update-fee/${students.admission_no}`, {
                fee_type: 'exam_fees'
            });
            console.log('Admin panel updated successfully');
        } catch (error) {
            console.error('Error updating admin panel:', error);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (paymentMode === 'online' && !transactionId) {
            setError('Please enter Transaction ID for online payments.');
            return;
        }

        if (!transactionDate) {
            setError('Please enter a transaction date.');
            return;
        }

        if (!transactionTime) {
            setError('Please enter a transaction time.');
            return;
        }

        try {
            await storeExamFeeTransactions();
            await updateAdminPanel(); 
            await axios.post(`${backend_path}/studentfee`, {
                email: students.email,
                ...students,
                exam_fees: 0,
            });
            navigate('/exam-fee-transactions');
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div className="provisional-container">
            <div className="provisional-header">
                <h1>Provisional Exam Fees</h1>
            </div>
            <form className="provisional-form" onSubmit={handlePaymentSubmit}>
                <div>
                    <label htmlFor="provisional">Select Provisional:</label>
                    <select id="provisional" value={provisionalStatus} onChange={handleProvisionalChange} className="provisional-select">
                        <option value="first">First Provisional</option>
                        <option value="second">Second Provisional</option>
                        <option value="third">Third Provisional</option>
                    </select>
                </div>
                <div>
                    <h2>Subjects for {provisionalStatus} Provisional</h2>
                    <ul className="provisional-list">
                        {subjects.map(subject => (
                            <li key={subject.subject_code} className="provisional-list-item">
                                {subject.subject_code} - ₹{subject.fee_amount.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
                <h2 className="provisional-total">Total Amount: ₹{totalAmount.toFixed(2)}</h2>
                <div className="payment-mode-container">
                    <label htmlFor="payment-mode">Payment Mode:</label>
                    <select id="payment-mode" value={paymentMode} onChange={handlePaymentModeChange} className="payment-mode-select">
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                {paymentMode === 'online' && (
                    <div className="transaction-id-container">
                        <label htmlFor="transaction-id">Enter Transaction ID:</label>
                        <input
                            type="text"
                            id="transaction-id"
                            value={transactionId}
                            onChange={handleTransactionIdChange}
                            className="transaction-id-input"
                        />
                    </div>
                )}
                <div className="transaction-date-container">
                    <label htmlFor="transaction-date">Enter Transaction Date:</label>
                    <input
                        type="date"
                        id="transaction-date"
                        value={transactionDate}
                        onChange={handleTransactionDateChange}
                        className="transaction-date-input"
                    />
                </div>
                <div className="transaction-time-container">
                    <label htmlFor="transaction-time">Enter Transaction Time:</label>
                    <input
                        type="time"
                        id="transaction-time"
                        value={transactionTime}
                        onChange={handleTransactionTimeChange}
                        className="transaction-time-input"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="provisional-button" disabled={amountToPay <= 0}>
                    Generate Payment Receipt
                </button>
            </form>
        </div>
    );
}

export default ProvisionalPage;
