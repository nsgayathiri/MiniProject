import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './HomePage.css';
function HomePage() {
    const navigate = useNavigate();
    const location= useLocation();
    const students = location.state?.students || {};

    const handleSelection = (type) => {
        if (type === 'provisional') {
            navigate('/exam-fees/Provisional',{ state: { students } });
        } else if (type === 'arrears') {
            navigate('/exam-fees/Arrears',{ state: { students } });
        }
    };

    return (
        <div className="home-container">
         
            <h1 className="home-title">Exam Fee Payment - Admin</h1>
            <button className="home-button" onClick={() => handleSelection('provisional')}>Provisional</button>
            <button className="home-button" onClick={() => handleSelection('arrears')}>Arrears</button>
        </div>
    );
}

export default HomePage;
