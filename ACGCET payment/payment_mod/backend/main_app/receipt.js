const puppeteer = require('puppeteer');
const pdftemplate = require('./hostel_receipt');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { EMAIL_USER,EMAIL_PASS,transporter } =require( './forgotpassword');



const download_receipt = async (req, res) => {
    try {
        const { paymentMode, email, amount, feestype, name, admission_no } = req.body;
        const feeDetails = getFeeDetails(feestype);

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          
        const page = await browser.newPage();

        // Generate the HTML content using the template function
        const htmlContent = pdftemplate({ name, admission_no, email, feeDetails, feestype, paymentMode, amount });

        // Set the HTML content on the Puppeteer page
        await page.setContent(htmlContent);

        // Generate the PDF file
        const pdfPath = path.join(__dirname, 'debug.pdf');
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
        await browser.close();

        // Read the PDF file into a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Your Fee Receipt',
            text: `Dear ${name},\n\nPlease find attached your fee receipt for ${feestype}.\n\nBest regards,\nFee Management Team`,
            attachments: [
                {
                    filename: 'fee_receipt.pdf',
                    content: pdfBuffer,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send({ error: 'Failed to send email.' });
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Send the PDF file to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=hostel_receipt.pdf`,
        });

        // Stream the PDF file to the client
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

        // Optionally delete the file after sending it
        fileStream.on('finish', () => {
            fs.unlink(pdfPath, (err) => {
                if (err) console.error('Error deleting PDF:', err);
            });
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An unexpected error occurred.' });
    }
};





// Fee details
const clgfeeDetails = [
    {particulars: "College Fee", amount: " "},
    {particulars: "Admission Fee", amount: " "},
    {particulars: "Book & Record Note fee", amount: " "},
    {particulars: "Computer & Internet fee", amount: " "},
    {particulars: "Library fee", amount: " "},
    {particulars: "Sports fee", amount: " "},
    {particulars: "Annual day / cultural fee", amount: " "},
    {particulars: "Counselling fee (Mental wellness)", amount: " "},
    {particulars: "Lab/Hospital fee", amount: " "},
    {particulars: "ID Card", amount: " "},
    {
        particulars: "BP Apparatus, Stethoscope, Knee Hammer, Tongue Depressor, Thermometer, Tuning fork, Pen torch",
        amount: " ",
    },
    {particulars: "Coat (White)", amount: " "},
    {particulars: "Guest Lecture classes & Seminars", amount: " "},
];

const hostelFeeDetails = [
    {particulars: "Hostel Fees / annum", amount: " "},
];

const HostelCautiondeposit = [
    {particulars: "Hostel Caution deposit (Refundable)", amount: " "},
];

const tutionfeeDetails = [
    {particulars: "Tuition Fees", amount: " "},
];

const registerFeeDetails = [
    {particulars: "Dr. MGR Medical University Students Registration fee", amount: " "},
];

const TransportFeeDetails = [
    {particulars: "Transport Boarding Point", amount: " "},
];

// Function to get fee details based on fee type
function getFeeDetails(feeType) {
    switch(feeType) {
        case 'College':
            return clgfeeDetails;
        case 'Hostel':
            return hostelFeeDetails;
        case 'CautionDeposit':
            return HostelCautiondeposit;
        case 'tuition_fees':
            return tutionfeeDetails;
        case 'Registration':
            return registerFeeDetails;
        case 'Transport':
            return TransportFeeDetails;
        default:
            return []; // Return an empty array for default case
    }
}

module.exports = {
    download_receipt
};
