import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';
import clglogo from '../../Assets/pictures/logo.png'
import { Logout } from '../../Widgets';
import { backend_path } from '../../constants/backend_path';

const AdminPanel = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const location= useLocation();
  const { key } = location.state || {};

  const handleTuitionPayNowClick = (students) => {
    navigate('/tuition-fees', { state: { students } });
  };
  const handleTransportPayNowClick = (students) => {
    navigate('/transport-fees', { state: { students } });
  };
  const handleHostelPayNowClick = (students) => {
    navigate('/hostel-fees', { state: { students } });
  };
  const handleOtherPayNowClick = (students) => {
    navigate('/other-fees', { state: { students } });
  };
  const handleCollegePayNowClick = (students) => {
    navigate('/college-fees', { state: { students } });
  };
  const handleCautionDepPayNowClick = (students) => {
    navigate('/caution-deposit', { state: { students } });
  };
  const handleRegistrationFeePayNowClick = (students) => {
    navigate('/reg-fees', { state: { students } });
  };
  const handlePaymentHistoryClick = () => {
    navigate('/payment-history',{state :{key :key}});
  };

  const handleExamFeesHistoryClick = () => {
    navigate('/exam-fees-transactions');
  };
  const handlePaymentRequestHistoryClick = () => {
    navigate('/payment-request',{state :{key :key}});
  };

  const handleExamFeeRequestHistoryClick = () => {
    navigate('/exam-fee-request',{state :{key :key}});
  };

  const handleExamFeesPayNowClick = (students) => {
    navigate('/exam-fees', { state: { students } });
  };
  const handleExamFeeChange = (e, students) => {
    e.preventDefault();  // If this is in a form, prevent default action
    navigate('/edit-fee',{state :{key : key}}, { state: { students } }); // Pass only students
  };
  
 // Centralized function for payment request logic
 const handlePaymentRequest = (feeType, student) => {
  const paymentDetails = {
    admission_no: student.admission_no,
    regno: student.regno,
    name: student.name,
    phone_no: student.phone_no,
    email: student.email,
    fee_type: feeType,
    amount: student[feeType.toLowerCase().replace(' ', '_')],
    status: 'pending',
  };
  
  axios.post(`${backend_path}/payment_request`, paymentDetails)
    .then(response => {
      console.log('Payment request added:', response.data);
      // Further logic to handle response can go here
    })
    .catch(error => {
      console.error("Error submitting payment request!", error);
    });
};


const handlePaymentCompletion = (feeType, student) => {
  const updatedData = {
    ...student,
    [feeType.toLowerCase().replace(' ', '_')]: 0, 
    status: 'paid',
  };

  axios.post(`${backend_path}/students/update/${student.admission_no}`, updatedData)
    .then(response => {
      console.log('Student fees updated:', response.data);
      // Reload students data
      axios.get(`${backend_path}/students_details`)
        .then(response => setStudents(response.data))
        .catch(error => console.error("Error fetching updated students data!", error));
    })
    .catch(error => console.error("Error updating student fees!", error));
};

  useEffect(() => {
    if (!key) {
      navigate('/');
    };


    axios.post(`${backend_path}/students_details/`)
      .then(response => {
        console.log('Fetched students:', response.data); 
        setStudents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const filteredStudents = students.filter(students => 
    students.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    students.regno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (students) => {
    setEditStudent(students);
    setTimeout(() => {
      const editSection = document.getElementById('edit-section');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0); 
    setFormData({ ...students });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("inside handle submit");
    console.log('Submitting form data:', formData);
    axios.post(`${backend_path}/students/`, formData)
      .then(response => {
        alert('Update successful:');
    
        axios.get(`${backend_path}/students_details`)
        .then(response => {
          setStudents(response.data);
          setEditStudent(null);
        })
         
          .catch(error => {
            console.error("There was an error fetching the data!", error);
          });
  
        
        window.location.reload();
      })
      
      .catch(error => {
        console.error("There was an error updating the data!", error);
      });
  };

  return (
    <div className="admin-panel">
      <div className="logo text-center">
        <img className='clg-logo' src={clglogo} alt='clg-logo'/>
        <h2 className='clg-name'>ALAGAPPA CHETTIAR GOVERNMENT COLLEGE OF ENGINEERING AND TECHNOLOGY</h2>
        <p>Karaikudi, Sivagangai District - 630003</p>
      </div>

      <div>
      <h1 className="h1">ADMIN PANEL</h1>

      <div className="button-container">
        <button className="history-button" onClick={handlePaymentHistoryClick}>Payment History</button>
        <button className="history-button" onClick={handleExamFeesHistoryClick}>Exam Fees History</button>
        <button className="history-button" onClick={handlePaymentRequestHistoryClick}>Payment Request History</button>
        <button className="history-button" onClick={handleExamFeeRequestHistoryClick}>Exam Fee Request History</button>
        <button className="history-button" onClick={handleExamFeeChange}>Edit Fee</button>

      </div>
    <div className='logout-button'><Logout/></div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="content-container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="tr">
                <th className="th">Admission Number</th>
                <th className="th">Register Number</th>
                <th className="th">Name</th>
                <th className="th">Gender</th>
                <th className="th">Date Of Birth</th>
                <th className="th">Email</th>
                <th className="th">Phone Number</th>
                <th className="th">Aadhar Number</th>
                <th className="th">Government School</th>
                <th className="th">Course Name</th>
                <th className="th">Year of Study / Batch</th>
                <th className="th">Quota</th>
                <th className="th">Registration Fees</th>
                <th className="th">College Fees</th>
                <th className="th">Hosteller/Dayscholar</th>
                <th className="th">Caution Deposit (Hostel)</th>
                <th className="th">Hostel Fees</th>
                <th className="th">Tuition Fees</th>
                <th className="th">Miscellaneous Fees</th>
                <th className="th">Reason</th>
                <th className="th">Transport Fees</th>
                <th className="th">Exam Fees</th>
                <th className="th">Status</th>
                <th className="th">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((students, index) => (
                  <tr key={index} className="tr">
                    <td className="td">{students.admission_no}</td>
                    <td className="td">{students.regno}</td>
                    <td className="td">{students.name}</td>
                    <td className="td">{students.gender}</td>
                    <td className="td">{students.dob}</td>
                    <td className="td">{students.email}</td>
                    <td className="td">{students.phone_no}</td>
                    <td className="td">{students.aadhar_no}</td>
                    <td className="td">{students.govt_school}</td>
                    <td className="td">{students.course_name}</td>
                    <td className="td">{students.batchyr}</td>
                    <td className="td">{students.quota}</td>
                    <td className="td">
                      {students.reg_fees}
                      {students.reg_fees > 0 && (
                        <Link to="/reg-fees" state={{ students }}>
                          <button className="button" onClick={() => handleRegistrationFeePayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    {/* College Fees */}

                    <td className="td">
                      {students.clg_fees}
                      {students.clg_fees > 0 && (
                        <Link to="/college-fees" state={{ students }}>
                          <button className="button" onClick={() => handleCollegePayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    
                    <td className="td">{students.hosteller}</td>
                    <td className="td">
                      {students.hosteller ? students.caution_deposit : "N/A"}
                      {students.caution_deposit > 0 && (
                        <Link to="/caution-deposit" state={{ students }}>
                          <button className="button" onClick={() => handleCautionDepPayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    
                    {/* Hostel Fees */}
                    <td className="td">
                      {students.hosteller ? students.hostel_fees : "N/A"}
                      {students.hostel_fees > 0 && (
                        <Link to="/hostel-fees" state={{ students }}>
                          <button className="button" onClick={() => handleHostelPayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    
                    {/* Tuition Fees */}
                    <td className="td">
                      {students.tuition_fees}
                      {students.tuition_fees > 0 && (
                        <Link to="/tuition-fees" state={{ students }}>
                          <button className="button" onClick={() => handleTuitionPayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>

                    {/* Other Fees */}
                    <td className="td">
                      {students.miscellaneous_fees}
                      {students.miscellaneous_fees > 0 && (
                        <Link to="/other-fees" state={{ students }}>
                          <button className="button" onClick={() => handleOtherPayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    
                    <td className="td">{students.reason}</td>
                    
                    
                    {/* Transport Fees */}
                    <td className="td">
                      {students.transport_fees}
                      {students.transport_fees > 0 && (
                        <Link to="/transport-fees" state={{ students }}>
                          <button className="button" onClick={() => handleTransportPayNowClick(students)}>Pay Now</button>
                        </Link>
                      )}
                    </td>
                    <td className="td">{students.exam_fees}
                        <Link to="/exam-fees" state={{ students }}>
                          <button className="button" onClick={() => handleExamFeesPayNowClick(students)}>Pay Now</button>
                        </Link>
                    </td>
                    <td className="td">{students.status}</td>
                    <td className="td">
                      <button className="button" onClick={() => handleEditClick(students)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="tr">
                  <td colSpan="21" className="no-data">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {editStudent && (
           <div id="edit-section" className="edit-section">
            <div className="edit-form">
              <h2>Edit Student Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender:</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date Of Birth:</label>
                    <input
                      type="text"
                      name="dob"
                      value={formData.dob|| ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phone_no"
                      value={formData.phone_no || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Aadhar Number:</label>
                    <input
                      type="text"
                      name="aadhar_no"
                      value={formData.aadhar_no || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Government School:</label>
                    <input
                      type="text"
                      name="govt_school"
                      value={formData.govt_school || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Course Name:</label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Year of Study / Batch:</label>
                    <input
                      type="text"
                      name="batchyr"
                      value={formData.batchyr || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quota:</label>
                    <input
                      type="text"
                      name="quota"
                      value={formData.quota || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>College Fees:</label>
                    <input
                      type="text"
                      name="clg_fees"
                      value={formData.clg_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hostel Fees:</label>
                    <input
                      type="text"
                      name="hostel_fees"
                      value={formData.hostel_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tuition Fees:</label>
                    <input
                      type="text"
                      name="tuition_fees"
                      value={formData.tuition_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Miscellaneous Fees:</label>
                    <input
                      type="text"
                      name="miscellaneous_fees"
                      value={formData.miscellaneous_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                

                <div className="form-row">
                  <div className="form-group">
                    <label>Reason:</label>
                    <input
                      type="text"
                      name="reason"
                      value={formData.reason || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Transport Fees:</label>
                    <input
                      type="text"
                      name="transport_fees"
                      value={formData.transport_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Exam Fees:</label>
                    <input
                      type="text"
                      name="exam_fees"
                      value={formData.exam_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Register Number:</label>
                    <input
                      type="number"
                      name="regno"
                      value={formData.regno || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Registration Fees:</label>
                    <input
                      type="text"
                      name="reg_fees"
                      value={formData.reg_fees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Caution Deposit:</label>
                    <input
                      type="text"
                      name="caution_deposit"
                      value={formData.caution_deposit || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                
                <div className="form-row">
                  <button type="submit" className="button">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminPanel;
