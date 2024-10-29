import React, {  useEffect,useState } from "react";

import axios from "axios";
import { useNavigate ,useLocation} from "react-router-dom"
import { backend_path } from "../../../constants/backend_path";
const EditFeePage = () => {
  const [formData, setFormData] = useState({
    clg_fees: "",
    tuition_fees: "",
    miscellaneous_fees: "",
    reason: "",
    transport_fees: "",
    reg_fees: "",
  });

  const [hostelData, setHostelData] = useState({
    hostel_fees: "",
    caution_deposit: "",
  });

  const [quotaType, setQuotaType] = useState("Govt");
  const [isHosteller, setIsHosteller] = useState("No");


  const location=useLocation();
  const navigate = useNavigate();
const {key}= location.state || {};
useEffect(() => {
  if(!key && key!=="SsSaDmin153@gmail.com"){
      navigate('/');
  }
})
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHostelChange = (e) => {
    const { name, value } = e.target;
    setHostelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuotaChange = (e) => {
    setQuotaType(e.target.value);
  };

  const handleHostellerChange = (e) => {
    setIsHosteller(e.target.value);
    if (e.target.value === "No") {
      setHostelData({ hostel_fees: "", caution_deposit: "" }); // Reset hostel data if not a hosteller
    }
  };

  const handleSubmitFees = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_path}/update-fees`,
        {
          ...formData,
          quotaType,
        }
      );

      const result = response.data;
      const username = "SsSaDmin153@gmail.com";
      console.log(result.message);
      alert("Fees updated successfully");
      navigate('/admin',{state:{key:username}})
      // Navigate or show success message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitHostel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_path}/updatehostelfees`,
        {
          ...hostelData,
          isHosteller,
        }
      );

      const result = response.data;
      const username = "SsSaDmin153@gmail.com";
      console.log(result.message);
      alert("Hostel Fees Updated succesfully");
      navigate('/admin',{state:{key:username}});
      // Navigate or show success message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id="edit-section" className="edit-section">
      <div className="edit-form">
        <form onSubmit={handleSubmitFees}>
          {/* Quota Type Dropdown */}
          <div className="form-group">
            <label>Select Quota Type:</label>
            <select value={quotaType} onChange={handleQuotaChange}>
              <option value="Govt">Government Quota</option>
              <option value="Management">Management Quota</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>College Fees:</label>
              <input
                type="text"
                name="clg_fees"
                value={formData.clg_fees}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Registration Fees:</label>
              <input
                type="text"
                name="reg_fees"
                value={formData.reg_fees}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tuition Fees ({quotaType} Quota):</label>
              <input
                type="text"
                name="tuition_fees"
                value={formData.tuition_fees}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Miscellaneous Fees:</label>
              <input
                type="text"
                name="miscellaneous_fees"
                value={formData.miscellaneous_fees}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reason:</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Transport Fees:</label>
              <input
                type="text"
                name="transport_fees"
                value={formData.transport_fees}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit">Update Fees</button>
        </form>

        {/* Hosteller Section */}
        <div className="hostel-section">
          <h3>Hostel Information</h3>
          <div className="form-group">
            <label>Hosteller</label>
            <select value={isHosteller} onChange={handleHostellerChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {isHosteller === "Yes" && (
            <form onSubmit={handleSubmitHostel}>
              <div className="form-row">
                <div className="form-group">
                  <label>Hostel Fees:</label>
                  <input
                    type="text"
                    name="hostel_fees"
                    value={hostelData.hostel_fees}
                    onChange={handleHostelChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Caution Deposit:</label>
                  <input
                    type="text"
                    name="caution_deposit"
                    value={hostelData.caution_deposit}
                    onChange={handleHostelChange}
                    required
                  />
                </div>
              </div>

              <button type="submit">Update Hostel Fees</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFeePage;
