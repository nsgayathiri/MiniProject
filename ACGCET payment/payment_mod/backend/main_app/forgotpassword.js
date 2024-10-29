const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { registration, db } = require('./db');


const EMAIL_USER = 'paymentmodule8@gmail.com'; // Replace with your Gmail address
const EMAIL_PASS = 'adid juxb ijpe qkmi'; // Replace with your App Password if using 2-Step Verification

const users = {}; // In-memory store for demo; replace with a database in production

// Set up Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Route to send OTP to email after verifying the email exists in the database
const OtpFunc = (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the 'users' table
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Email found, proceed to generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    users[email] = { otp }; // Store OTP in memory; replace with a database in production

    // Send OTP to user's email
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      res.json({ message: 'OTP sent to your email.' });
    });
  });
};

// Route to verify OTP
const VerifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const user = users[email];

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or OTP' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  res.json({ message: 'OTP verified successfully.' });
};

// Route to reset password
const ResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = users[email];

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or OTP' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Store the new password in place of the OTP
  users[email] = { password: hashedPassword };
  db.query("UPDATE users SET password= ? WHERE email= ?", [hashedPassword, email], (err, result) => {
    if (err) {
      console.error('Error resetting password:', err);
      return res.status(500).json({ message: 'Password reset failed', error: err.message });
    }
    res.status(200).json({ message: 'Password reset successfully.' });
  });
};

// Another method to update the password if needed (as per previous code)
const UpdatePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    user.otp = undefined; // Clear OTP after password reset
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  OtpFunc,
  ResetPassword,
  VerifyOtp,
  UpdatePassword,
  EMAIL_USER,
  EMAIL_PASS,
  transporter
};
