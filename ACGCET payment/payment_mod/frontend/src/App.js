import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import "./App.css";
import {
  Login,
  Register,
  Dashboard,
  AdminPanel,
  TuitionFeesPage,
  HostelFeesPage,
  CollegeFeesPage,
  OtherFeesPage,
  TransportFeesPage,
  RegistrationFeesPage,
  CautionDeposit,
  PaymentHistory,
  HomePage,
  ProvisionalPage,
  ArrearsPage,
  ExamFeeTransactions,
  ProvisionalExamFeesOnline,
  ForgotPassword,
  AddData,
  ArrearExamFeesOnline,
  EditFeePage,
  
   // Import the Edit Fee Page
} from './Pages';
import PaymentRequest from "./Pages/AdminPanel/Request/PaymentRequest"
import ExamFeeRequests from "./Pages/AdminPanel/Request/ExamFeeRequests"
// import Footer from "./Components/Footer/Footer";
import OnlinePayment from "./Pages/OnlinePayment/OnlinePayment";

import { Footer } from './Components';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password route */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tuition-fees" element={<TuitionFeesPage />} />
        <Route path="/hostel-fees" element={<HostelFeesPage />} />
        <Route path="/college-fees" element={<CollegeFeesPage />} />
        <Route path="/other-fees" element={<OtherFeesPage />} />
        <Route path="/transport-fees" element={<TransportFeesPage />} />
        <Route path="/reg-fees" element={<RegistrationFeesPage />} />
        <Route path="/caution-deposit" element={<CautionDeposit />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/exam-fees" element={<HomePage />} />
        <Route path="/exam-fees/Provisional" element={<ProvisionalPage />} />
        <Route path="/exam-fees/Arrears" element={<ArrearsPage />} />
        <Route path="/exam-fees-transactions" element={<ExamFeeTransactions />} />
        <Route path="/payment-request" element={<PaymentRequest />} />
        <Route path="/online-payment" element={<OnlinePayment />} />
        <Route path="/online-payment-exam-provisional" element={<ProvisionalExamFeesOnline />} />
        <Route path="/online-payment-exam-arrear" element={<ArrearExamFeesOnline />} />
        <Route path="/exam-fee-request" element={<ExamFeeRequests />} />
        <Route path="/add-data" element={<AddData />} />
        <Route path="/edit-fee" element={<EditFeePage />} /> {/* Add route for Edit Fee Page */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
