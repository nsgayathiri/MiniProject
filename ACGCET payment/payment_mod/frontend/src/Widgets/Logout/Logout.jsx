import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();
  function logOut() {
    navigate("/", { replace: true });
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, null, window.location.href);
    });
  }
  return (
    <div>
      <button onClick={logOut} className="logout_btn">
        Logout
      </button>
    </div>
  );
};

export default Logout;
