import React, { useState } from "react";
import s from "./LogoutButton.module.scss";

const LogoutButton = ({ onLogout }) => {
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    setSuccess(true);
    if (onLogout) {
      onLogout();
    }
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <button
      className={`${s.button} ${success ? s.success : ""}`}
      onClick={handleClick}
      type="button"
    >
      <span>Вийти</span>
      <div className={s.icon}>
        <i className="fa fa-remove" aria-hidden="true"></i>
        {/* <i className="fa fa-check" aria-hidden="true"></i> */}
      </div>
    </button>
  );
};

export default LogoutButton;
