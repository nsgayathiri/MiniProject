import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExamFeeRequests.css'; // Optional, for styling
import { useNavigate ,useLocation} from "react-router-dom"
import { backend_path } from '../../../constants/backend_path';

const ExamFeeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location=useLocation();
    const navigate = useNavigate();
  const {key}= location.state || {};


    useEffect(() => {
        if(!key && key!=="SsSaDmin153@gmail.com"){
            navigate('/');
        }
      
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${backend_path}/display-examfee-requests`);
                setRequests(response.data);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    
    const handleTransactionUpdate = async (request, action) => {
        try {
            const { name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date, transaction_time } = request;

            // If action is "add", add to exam fee
            if (action === 'add') {
                await axios.post(`${backend_path}/examfee/record`, {
                    name,
                    regno,
                    email,
                    type,
                    mode,
                    amount,
                    no_of_subjects,
                    transaction_id,
                    transaction_date,
                    transaction_time
                });
                 // Pass email to the update function
                alert('Exam fee record added!');
            }

            // Update the status in the payment request table
            const status = action === 'add' ? 'verified' : 'rejected';
            await axios.put(`${backend_path}/payment-request/${transaction_id}`, { status });

            alert(`Payment request status updated to ${status}!`);

            await axios.post(`${backend_path}/update-admin-panel`, {
                email,
                fee_type: "exam_fees"
            });

            alert('Admin panel updated!');

         
            const response = await axios.get(`${backend_path}/display-examfee-requests`);
            setRequests(response.data);
        } catch (err) {
            alert('Error updating payment request: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="exam-fee-requests">
            <h1>Exam Fee Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>Bill No</th>
                        <th>Name</th>
                        <th>Reg No</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Mode</th>
                        <th>Amount</th>
                        <th>No of Subjects</th>
                        <th>Transaction ID</th>
                        <th>Transaction Date</th>
                        <th>Transaction Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.billno}>
                            <td>{request.billno}</td>
                            <td>{request.name}</td>
                            <td>{request.regno}</td>
                            <td>{request.email}</td>
                            <td>{request.type}</td>
                            <td>{request.mode}</td>
                            <td>{request.amount}</td>
                            <td>{request.no_of_subjects}</td>
                            <td>{request.transaction_id}</td>
                            <td>{request.transaction_date}</td>
                            <td>{request.transaction_time}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status !== 'verified' && request.status !== 'rejected' && (
                                    <>
                                        <button onClick={() => handleTransactionUpdate(request, 'add')}>Add to Exam Fee</button>
                                        <button onClick={() => handleTransactionUpdate(request, 'reject')}>Reject Transaction</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> 
        </div>
    );
};

export default ExamFeeRequests;
