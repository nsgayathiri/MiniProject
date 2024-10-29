import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./OnlinePayment.css";
import qrCodeImage from "../../Assets/pictures/qr.png";
import clglogo from "../../Assets/pictures/logo.png";
import { backend_path } from "../../constants/backend_path";

const OnlinePayment = () => {
  const location = useLocation();
  const students = location?.state?.students || {};
  const { studentName, admissionNo, feeType, amount, email, phone_no, regno } =
    location.state || {};
  const [totalFeeAmount, setTotalFeeAmount] = useState(Number(amount) || 0);
  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionTime, setTransactionTime] = useState("");
  const [isPaymentTypeSelected, setIsPaymentTypeSelected] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("Pending");
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [error, setError] = useState("");
  const [paidAmount, setPaidAmount] = useState(""); // Amount paid
  const [loading, setLoading] = useState(false); // Loading state
  const paymentMode = "online";
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  });

  const StorePaymentRequestDetails = async () => {
    try {
      const amountToStore =
        (feeType === "tuition_fees" || feeType === "hostel_Fees") ? parseFloat(paidAmount) : totalFeeAmount; // Calculate the remaining amount

      await axios.post(`${backend_path}/storepaymentrequest`, {
        name: studentName,
        email: email,
        admission_no: admissionNo,
        regno: regno,
        phone_no: phone_no,
        cash_mode: paymentMode,
        transactionId,
        transactionDate: `${transactionDate} ${transactionTime}`,
        feeType,
        amount: amountToStore, // Store the remaining amount
        status: "pending",
      });
      console.log("Payment details stored successfully");
      alert("Payment submitted, verification in progress");
      navigate("/dashboard", { state: { key: email } });
    } catch (error) {
      console.error("Error storing payment details:", error);
      setError("Failed to store payment details.");
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const handlePayOnlineClick = () => {
    setShowQRCode(true);
    setIsPaymentInitiated(true);
  };

  const handleSubmitPayment = async () => {
    setError("");
    setLoading(true); // Set loading to true when form is submitting

    // Validate input
    if (!transactionId) {
      setError("Please enter Transaction ID for online payments.");
      setLoading(false);
      return;
    }

    if (!transactionDate || !transactionTime) {
      setError("Please enter both transaction date and time.");
      setLoading(false);
      return;
    }

    // Validate the paid amount
    if (feeType === "tuition_fees" || feeType==="hostel_Fees") {
      const parsedPaidAmount = parseFloat(paidAmount);
      if (
        isNaN(parsedPaidAmount) ||
        parsedPaidAmount < 0 ||
        parsedPaidAmount > totalFeeAmount
      ) {
        alert(
          `Please enter a valid amount between ₹0 and ₹${totalFeeAmount.toFixed(
            2
          )}.`
        );
        setLoading(false);
        return;
      }
    }

    try {
      await StorePaymentRequestDetails(); // Store the payment request details
    } catch (error) {
      console.error("Error during payment submission:", error);
      setError("Failed to complete payment process.");
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = "payment-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="online-payment-div">
      <div className="logo text-center">
        <img className="clg-logo" src={clglogo} alt="clg-logo" />
        <h2>SUDHA SASEENDRAN SIDDHA MEDICAL COLLEGE AND HOSPITAL</h2>
        <p>Mecode, Kaliyakkavilai Post, Kanyakumari District - 629153</p>
      </div>
      <div className="fee-payment-container">
        <h1 className="title">Online Fee Payment</h1>
        <div className="online-fee-students-details">
          <p>
            Student Name: <span>{studentName || ""}</span>
            <br />
            <span>{!studentName && "N/A"}</span>
          </p>
          <p>
            Admission No: <span>{admissionNo || ""}</span>
            <br />
            <span>{!admissionNo && "N/A"}</span>
          </p>
          <p>
            Fee Type: <span>{feeType || ""}</span>
            <br />
            <span>{!feeType && "N/A"}</span>
          </p>

          <p>
            Phone Number: <span>{phone_no || ""}</span>
            <br />
            <span>{!phone_no && "N/A"}</span>
          </p>
          <p>
            Email: <span>{email || ""}</span>
            <br />
            <span>{!email && "N/A"}</span>
          </p>
          <p>
            Reg No: <span>{regno || ""}</span>
            <br />
            <span>{!regno && "N/A"}</span>
          </p>
        </div>
        <div className="fee-details">
          <h2 className="fee-type">Fee Type: {feeType}</h2>
          <h3 className="fee-amount">
            Fee Amount: ₹
            {typeof totalFeeAmount === "number"
              ? totalFeeAmount.toFixed(2)
              : "0.00"}
          </h3>
        </div>

        {(feeType === "tuition_fees" || "hostel_Fees") && (
          <div className="amount-container">
            <label htmlFor="amount-paid">Enter Amount Paying now:</label>
            <input
              type="text"
              id="amount-paid"
              value={paidAmount}
              onChange={(e) => {
                const value = e.target.value;
                setPaidAmount(value === "" ? "" : parseFloat(value) || 0);
              }}
              className="amount-input"
            />
          </div>
        )}

        {showQRCode && (
          <div className="payment-info-container">
            <div className="qr-code-container">
              <h3>QR Code for Payment</h3>
              <img
                src={qrCodeImage}
                alt="Payment QR Code"
                style={{ width: "200px", height: "200px" }}
              />
              <button type="button" onClick={downloadQRCode}>
                Download QR Code
              </button>
            </div>
            <div className="transaction-id-container">
              <label htmlFor="transaction-id">Enter Transaction ID:</label>
              <input
                type="text"
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="transaction-id-input"
              />
            </div>
            <div className="date-time-container">
              <label htmlFor="transaction-date">Enter Transaction Date:</label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="transaction-date-input"
              />
            </div>
            <div className="time-container">
              <label htmlFor="transaction-time">Enter Transaction Time:</label>
              <input
                type="time"
                value={transactionTime}
                onChange={(e) => setTransactionTime(e.target.value)}
                className="transaction-time-input"
              />
            </div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {!isPaymentInitiated ? (
          <button
            type="button"
            onClick={handlePayOnlineClick}
            className="payment-button"
          >
            Pay Online
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitPayment}
            className="submit-payment-button"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OnlinePayment;
