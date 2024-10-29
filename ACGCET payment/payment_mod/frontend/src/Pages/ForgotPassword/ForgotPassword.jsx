import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { backend_path } from '../../constants/backend_path';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // State to check if OTP is sent
  const [otpVerified, setOtpVerified] = useState(false); // State to check if OTP is verified
  const [newPassword, setNewPassword] = useState(''); // State to handle new password input
  const navigate = useNavigate();
  // Function to handle sending OTP to user's email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_path}/forgot-password`, { email });
      setMessage(response.data.message);
      setOtpSent(true); // Set OTP sent state to true
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset password email.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password reset (OTP is checked on the backend)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_path}/reset-password`, { email, otp, newPassword });
      setMessage(response.data.message);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-div">
      <h2 className="forgot-password-header">Forgot Password</h2>

      {!otpSent && (
        <form className="forgot-password-form" onSubmit={handleSendOtp}>
          <input
            type="email"
            className="forgot-password-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {otpSent && (
        <form className="forgot-password-form" onSubmit={handleResetPassword}>
          <input
            type="text"
            className="forgot-password-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            className="forgot-password-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {message && <p className="forgot-password-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
