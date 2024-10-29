import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import qrCodeImage from '../../Assets/pictures/qr.png';
import './ProvisionalExamFeesOnline.css';
import { backend_path } from '../../constants/backend_path';

function ProvisionalExamFeesOnline() {
    const location = useLocation();
    const students = location.state?.student || {};
    const [provisionalStatus, setProvisionalStatus] = useState('first');
    const [subjects, setSubjects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [amountToPay, setAmountToPay] = useState(0);
    const [showQRCode, setShowQRCode] = useState(false);
    const [transactionDateTime, setTransactionDateTime] = useState('');
    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
    const [error, setError] = useState('');
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

    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
    };

    const handlePayOnlineClick = () => {
        setShowQRCode(true);
        setIsPaymentInitiated(true); 
    };

    const handleSubmitPayment = async() => {
        setError(''); 
        if (!transactionId) {
            setError('Please enter Transaction ID for online payments.');
            return;
        }

        if (!transactionDateTime) {
            setError('Please enter both transaction date and time.');
            return;
        }

        const [date, time] = transactionDateTime.split('T');
        if (!date || !time) {
            setError('Please ensure the date and time are correctly entered.');
            return;
        }

        try {
            const response = await axios.post(`${backend_path}/examfee-request`, {
                name :students.name,
                regno :students.regno,
                email :students.email,
                type :"regular",
                mode :"online",
                transaction_id :transactionId,
                transaction_date: date,         
                transaction_time: time,        
                amount: amountToPay,
                no_of_subjects: subjects.length,
                status: 'pending',              
            });
            
            alert('Payment submitted successfully');
            
        } catch (error) {
            setError('Error submitting payment: ' + (error.response?.data.message || error.message));
        }

     
    };

    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.href = qrCodeImage;
        link.download = 'payment-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

   

    return (
        <div className="provisional-container">
            <div className="provisional-header">
                <h1>Provisional Exam Fees</h1>
            </div>
            <form className="provisional-form">
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

                {showQRCode && (
                    <div className="payment-info-container">
                        <div className="qr-code-container">
                            <h3>QR Code for Payment</h3>
                            <img src={qrCodeImage} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
                            <button type="button" onClick={downloadQRCode}>Download QR Code</button>
                        </div>
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
                        <div className="date-time-container">
                            <label htmlFor="transaction-date">Enter Transaction Date:</label>
                            <input
                                type="date"
                                value={transactionDateTime.split('T')[0] || ''}  
                                onChange={(e) => setTransactionDateTime(`${e.target.value}T${transactionDateTime.split('T')[1] || ''}`)}
                                className="transaction-date-input"
                            />
                        </div>
                        <div className="time-container">
                            <label htmlFor="transaction-time">Enter Transaction Time:</label>
                            <input
                                type="time"
                                value={transactionDateTime.split('T')[1] || ''}
                                onChange={(e) => setTransactionDateTime(`${transactionDateTime.split('T')[0]}T${e.target.value}`)}
                                className="transaction-time-input"
                            />
                        </div>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>} 

                {!isPaymentInitiated ? (
                    <button type="button" onClick={handlePayOnlineClick} className="provisional-button">
                        Pay Online
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmitPayment} className="provisional-button">
                        Submit Payment
                    </button>
                )}
            </form>
        </div>
    );
}

export default ProvisionalExamFeesOnline;
