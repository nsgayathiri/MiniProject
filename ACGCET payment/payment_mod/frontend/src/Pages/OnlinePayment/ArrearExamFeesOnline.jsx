import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import qrCodeImage from '../../Assets/pictures/qr.png';
import './ArrearExamFeesOnline.css';
import { backend_path } from '../../constants/backend_path';

function ArrearExamFeesOnline() {
    const location = useLocation();
    const students = location.state?.student || {};
    const [allSubjects, setAllSubjects] = useState([]);
    const [arrearSubjects, setArrearSubjects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('offline');
    const [transactionId, setTransactionId] = useState('');
    const navigate = useNavigate();
    const [showQRCode, setShowQRCode] = useState(false);
    const [transactionDateTime, setTransactionDateTime] = useState('');
    const [error, setError] = useState('');
    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false); 

    useEffect(() => {
        const fetchAllSubjects = async () => {
            try {
                const response = await axios.get(`${backend_path}/subjects`);
                const fetchedAllSubjects = response.data.map(subject => ({
                    ...subject,
                    fee_amount: parseFloat(subject.fee_amount) || 0
                }));
                setAllSubjects(fetchedAllSubjects);
            } catch (error) {
                console.error('Error fetching all subjects', error.response?.data || error.message);
            }
        };

        fetchAllSubjects();
    }, []);

    useEffect(() => {
        const calculateTotalAmount = () => {
            const arrearFees = arrearSubjects.reduce((sum, sub) => sum + (sub.fee_amount || 0), 0);
            setTotalAmount(arrearFees);
        };

        calculateTotalAmount();
    }, [arrearSubjects]);

    const handleChange = (selectedOptions) => {
        const selectedSubjects = selectedOptions.map(option => {
            const subject = allSubjects.find(sub => sub.subject_code === option.value);
            return {
                ...option,
                fee_amount: subject?.fee_amount || 0
            };
        });
        setArrearSubjects(selectedSubjects);
        setError(''); 
    };



    const handleRemoveArrear = (subjectCode) => {
        setArrearSubjects(prev => prev.filter(sub => sub.value !== subjectCode));
    };

    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
    };

    const handlePayOnlineClick = () => {
        if (arrearSubjects.length === 0) {
            setError('Please select at least one subject.');
            return;
        }
        setShowQRCode(true);
        setIsPaymentInitiated(true); 
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setError('');

      
        if (arrearSubjects.length === 0) {
            setError('Please select at least one subject.');
            return;
        }

        
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
                    type :"arrear",
                    mode :"online",
                    transaction_id :transactionId,
                    transaction_date: date,         // Use date directly
                    transaction_time: time,         // Use time directly
                    amount: totalAmount,
                    no_of_subjects: arrearSubjects.length,
                    status: 'pending',               // Set status as 'pending'
                });
        
                alert('Payment submitted successfully ');
                
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

    const subjectOptions = allSubjects.map(subject => ({
        value: subject.subject_code,
        label: `${subject.subject_code} - ₹${subject.fee_amount.toFixed(2)}`
    }));

    const storeExamFeeTransactions = async () => {
        const paymentDate = new Date().toISOString().slice(0, 10); 
        try {
            await axios.post(`${backend_path}/examfee/record`, {
                name: students.name,
                regno: students.regno,
                email: students.email,
                type: 'arrear',
                mode: paymentMode,
                amount: totalAmount,
                no_of_subjects: arrearSubjects.length,
                transaction_id: paymentMode === 'online' ? transactionId : 'cash',
                transaction_time: paymentDate
            });
            console.log('Payment details stored successfully');
        } catch (error) {
            console.error('Error storing payment details:', error);
        }
    };

    return (
        <div className="arrears-container">
            <div className="arrears-header">
                <h1>Select Arrears Subjects</h1>
            </div>
            <form onSubmit={handleSubmitPayment}>
                <div className="arrear-subject-select-container">
                    <label htmlFor="arrear-subject" className="arrear-subject-select-label">
                        Select subjects to add as arrears:
                    </label>
                    <Select
                        id="arrear-subject"
                        isMulti
                        options={subjectOptions}
                        onChange={handleChange}
                        value={arrearSubjects}
                        className="arrears-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="arrears-list-container">
                    <h3>Selected Subjects</h3>
                    <ul className="arrears-list">
                        {arrearSubjects.map(subject => (
                            <li key={subject.value} className="arrears-list-item">
                                {subject.label}
                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => handleRemoveArrear(subject.value)}
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <h2 className="arrears-total">Total Amount: ₹{totalAmount.toFixed(2)}</h2>
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
                                value={transactionDateTime.split('T')[0]} 
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

                {!isPaymentInitiated && (
                    <button type="button" onClick={handlePayOnlineClick} className="arrears-button">
                        Pay Online
                    </button>
                )}

                {isPaymentInitiated && ( 
                    <button type="submit" className="arrears-button" disabled={!showQRCode}>
                        Submit Payment
                    </button>
                )}
            </form>
        </div>
    );
}

export default ArrearExamFeesOnline;
