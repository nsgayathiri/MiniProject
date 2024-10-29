import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentRequest.css';
import clglogo from '../../../Assets/pictures/logo.png';
import { backend_path } from '../../../constants/backend_path';

const RequestTable = () => {
    const [requestList, setRequestList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(null); // Track loading for specific requests
    const location = useLocation();
    const { key } = location.state || {};

    useEffect(() => {
        if (!key || key !== "SsSaDmin153@gmail.com") {
            navigate('/');
        }
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${backend_path}/displaypaymentrequest`);
            setRequestList(response.data);
        } catch (error) {
            console.error('Error fetching payment requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentStatusUpdate = async (request, action) => {
        setButtonLoading(request.transaction_id); // Set button loading for specific request
        try {
            const { admission_no, name, regno, email, phone_no, fee_type, cash_mode, transaction_id, transaction_date, amount } = request;

            if (action === 'add') {
                await axios.post(`${backend_path}/storeinpaymentrequestdb`, {
                    admission_no,
                    name,
                    regno,
                    email,
                    phone_no,
                    fee_type,
                    cash_mode,
                    transaction_id,
                    transaction_date,
                    amount
                });
                await axios.post(`${backend_path}/download_receipt`, {
                    email,
                    amount,
                    feestype: fee_type,
                    paymentMode: cash_mode,
                    name,
                    admission_no
                }, { responseType: "blob" });
                alert('Payment Request fee record added!');
            }

            const status = action === 'add' ? 'verified' : 'rejected';
            await axios.post(`${backend_path}/updatepaymentrequestaspaid/${transaction_id}`, { status });

            alert(`Payment request status updated to ${status}!`);

            await axios.post(`${backend_path}/update-fee-adminpanel`, {
                admission_no,
                fee_type,
                amount,
            });

            alert('Admin panel updated!');

            // Refresh requests after the update
            fetchRequests();

        } catch (err) {
            alert('Error updating payment request: ' + (err.response?.data?.error || err.message));
        } finally {
            setButtonLoading(null); // Reset button loading
        }
    };

    if (loading) return <div>Loading...</div>;

    const username = "SsSaDmin153@gmail.com";

    return (
        <div className="request-table-container">
            <div className="logo text-center">
                <img className='clg-logo' src={clglogo} alt='clg-logo' />
                <h2>SUDHA SASEENDRAN SIDDHA MEDICAL COLLEGE AND HOSPITAL</h2>
                <p>Meecode, Kaliyakkavilai Post, Kanyakumari District - 629153</p>
            </div>

            <h1 className="h1">Payment Requests</h1>
            <div className="button-container">
                <button className="history-button" onClick={() => navigate('/admin', { state: { key: username } })}>
                    Admin Panel
                </button>
                <button className="history-button" onClick={() => navigate('/payment-history',{state:{key : key}})}>
                    Payment History
                </button>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="tr">
                            <th className="th">Bill No</th>
                            <th className="th">Admission Number</th>
                            <th className="th">Registration Number</th>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Phone Number</th>
                            <th className="th">Payment Mode</th>
                            <th className="th">Transaction ID</th>
                            <th className="th">Transaction Date</th>
                            <th className="th">Fee Type</th>
                            <th className="th">Amount</th>
                            <th className="th">Status</th>
                            <th className="th">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.length ? (
                            requestList.map((request, index) => (
                                <tr key={index} className="tr">
                                    <td className="td">{request.bill_no}</td>
                                    <td className="td">{request.admission_no}</td>
                                    <td className="td">{request.regno}</td>
                                    <td className="td">{request.name}</td>
                                    <td className="td">{request.email}</td>
                                    <td className="td">{request.phone_no}</td>
                                    <td className="td">{request.cash_mode}</td>
                                    <td className="td">{request.transaction_id}</td>
                                    <td className="td">{request.transaction_date}</td>
                                    <td className="td">{request.fee_type}</td>
                                    <td className="td">₹{request.amount}</td>
                                    <td className="td">{request.status}</td>
                                    <td className="td">
                                        {request.status !== 'verified' && request.status !== 'rejected' && (
                                            <>
                                                <button onClick={() => handlePaymentStatusUpdate(request, 'add')} disabled={buttonLoading === request.transaction_id}>
                                                    {buttonLoading === request.transaction_id && 'Processing...'}
                                                    {buttonLoading !== request.transaction_id && 'Add to Payment History'}
                                                </button>
                                                <button onClick={() => handlePaymentStatusUpdate(request, 'reject')} disabled={buttonLoading === request.transaction_id}>
                                                    {buttonLoading === request.transaction_id && 'Processing...'}
                                                    {buttonLoading !== request.transaction_id && 'Reject Transaction'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="no-data">No payment requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestTable;
