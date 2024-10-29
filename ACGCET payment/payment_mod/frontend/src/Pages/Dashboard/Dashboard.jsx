import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import clglogo from "../../Assets/pictures/logo.png";
import axios from "axios";
import { Logout } from "../../Widgets";
import { backend_path } from "../../constants/backend_path";

const Dashboard = () => {
  const [student, setStudent] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { key } = location.state || {};

  useEffect(() => {
    if (!location.state || !location.state.key) {
      navigate("/");
    }

    async function fetchData() {
      try {
        if (key) {
          const response = await axios.post(
            `${backend_path}/dashboard/`,
            {
              studentEmail: key,
            }
          );
          setStudent(response.data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchData();
  }, [key]);

  return (
    <div className="dashboard">
      <div className="header text-center">
        <img className="clg-logo" src={clglogo} alt="College Logo" />
        <h2 className='clg-name'>ALAGAPPA CHETTIAR GOVERNMENT COLLEGE OF ENGINEERING AND TECHNOLOGY</h2>
        <p>Karaikudi, Sivagangai District - 630003</p>
      </div>
      <h2>Student Dashboard</h2>

      <h1 style={{ color: "#00134d", display: "block", marginBottom: "20px" }}>
        Personal Details
      </h1>
      <div className="cards-container">
        <div className="card">
          <p>
            <strong>Admission No:</strong> {student.admission_no}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Registration No:</strong> {student.regno}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Name:</strong> {student.name}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Gender:</strong> {student.gender}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Email:</strong> {student.email}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Phone No:</strong> {student.phone_no}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Aadhar No:</strong> {student.aadhar_no}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>DOB:</strong> {student.dob}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Batch Year:</strong> {student.batchyr}
          </p>
        </div>
      </div>

      <div className="section-gap"></div>

      <h1 style={{ color: "#00134d", display: "block", marginBottom: "20px" }}>
        College Details
      </h1>
      <div className="cards-container">
        <div className="card">
          <p>
            <strong>Course Name:</strong> {student.course_name}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Hosteller:</strong> {student.hosteller}
          </p>
        </div>
        <div className="card">
          <p>
            <strong>Hostel Fees:</strong> {student.hostel_fees}
          </p>
          {student.hostel_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "hostel_Fees",
                    amount: student.hostel_fees,
                    regno: student.regno,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Hostel Fees
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Tuition Fees:</strong> {student.tuition_fees}
          </p>
          {student.tuition_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "tuition_fees",
                    regno: student.regno,
                    amount: student.tuition_fees,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Tuition Fees
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Transport Fees:</strong> {student.transport_fees}
          </p>
          {student.transport_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "transport_fees",
                    regno: student.regno,
                    amount: student.transport_fees,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Transport Fees
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Caution Deposit:</strong> {student.caution_deposit}
          </p>
          {student.caution_deposit > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "caution_deposit",
                    regno: student.regno,
                    amount: student.caution_deposit,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Caution Deposit
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>College Fees:</strong> {student.clg_fees}
          </p>
          {student.clg_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "clg_fees",
                    regno: student.regno,
                    amount: student.clg_fees,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay College Fees
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Exam Fees:</strong> {student.exam_fees}
          </p>
          {student.exam_fees > 0 && (
            <>
              <button
                onClick={() =>
                  navigate("/online-payment-exam-provisional", {
                    state: { student },
                  })
                }
              >
                Pay Provisional Exam Fees
              </button>
              <button
                onClick={() =>
                  navigate("/online-payment-exam-arrear", { state: { student } })
                }
              >
                Pay Arrear Exam Fees
              </button>
            </>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Registration Fees:</strong> {student.reg_fees}
          </p>
          {student.reg_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "Registration Fees",
                    regno: student.regno,
                    amount: student.reg_fees,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Registration Fees
            </button>
          )}
        </div>
        <div className="card">
          <p>
            <strong>Miscellaneous Fees:</strong> {student.miscellaneous_fees}
          </p>
          {student.miscellaneous_fees > 0 && (
            <button
              onClick={() =>
                navigate("/online-payment", {
                  state: {
                    studentName: student.name,
                    admissionNo: student.admission_no,
                    feeType: "Miscellaneous Fees",
                    regno: student.regno,
                    amount: student.miscellaneous_fees,
                    phone_no: student.phone_no,
                    email: student.email,
                  },
                })
              }
            >
              Pay Miscellaneous Fees
            </button>
          )}
        </div>
      </div>

     
      <div className="reason-box">
  <p>
    <strong>Reason:</strong> {student.reason}
  </p>
</div>
      <div>
        <Logout />
      </div>
    </div>
  );
};

export default Dashboard;
