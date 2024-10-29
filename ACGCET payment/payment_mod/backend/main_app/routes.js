const express = require('express');
const router = express.Router();
const multer = require('multer');
const { download_receipt } = require('./receipt');
const { registration, FeeUpdate, getStudents, updateStudent, StoreInPayment, DisplayPayment, displaySubject, DisplayExamFeeTransactions, StoreInExamFee, StoreInPaymentRequest, getPaymentRequest,UpdateAdminPanel, DisplayExamFeeRequests,paymentRequestUpdate, StoreInPaymentFromDashboard,updateFees, updateHostelFees} = require('./db'); 
const { login } = require('./db');
const { displayDashboard ,StoreInExamFeeRequest,handleExamFeeTransaction,updateExamFeeRequestStatus,UpdateAdminPanelFromRequest} = require('./db');
const {OtpFunc,VerifyOtp,ResetPassword}=require('./forgotpassword');
const verifyToken = require('./authMiddleware');


const {insertData}=require('./db');
const {emailcheck,Aadharcheck}=require('./db');

const upload = multer();

router.post('/api/download_receipt', download_receipt);
router.post('/api/register',upload.none(),registration);
router.post('/api/check-email/',emailcheck);
router.post('/api/login',login);
router.post('/api/students_details/', getStudents);
router.post('/api/students', updateStudent);
router.post('/api/dashboard/', displayDashboard);;
router.post('/api/verify-otp', VerifyOtp);
router.post('/api/forgot-password', OtpFunc);
router.post('/api/reset-password', ResetPassword);
router.post('/api/update-fees', updateFees);
router.post('/api/updatehostelfees',updateHostelFees);





// router.post('/api/update-password',UpdatePassword);



router.post('/api/studentfee', FeeUpdate);
router.post('/api/StorePaymentDetails', StoreInPayment);
router.post('/api/payment-history', DisplayPayment);
router.get('/api/subjects', displaySubject); 
router.get('/api/examfee/transactions', DisplayExamFeeTransactions);
router.post('/api/examfee/record', StoreInExamFee);
router.post('/api/storepaymentrequest',StoreInPaymentRequest);
router.post('/api/displaypaymentrequest',getPaymentRequest);
router.post('/api/update-fee-adminpanel',UpdateAdminPanel);
router.post('/api/updatepaymentrequestaspaid/:transaction_id',paymentRequestUpdate);
//router.post('/api/verify-payment',verifyPayment)
router.post('/api/examfee-request', StoreInExamFeeRequest);
router.get('/api/display-examfee-requests', DisplayExamFeeRequests);
router.put('/api/payment-request/:transaction_id', updateExamFeeRequestStatus);
//router.post('/api/payment-request/action', handleExamFeeTransaction);
router.post('/api/update-admin-panel', UpdateAdminPanelFromRequest);
router.post('/api/add-data',insertData);
router.post('/api/check-aadhar/',Aadharcheck);
router.post('/api/storeinpaymentrequestdb', StoreInPaymentFromDashboard);





module.exports = router;
