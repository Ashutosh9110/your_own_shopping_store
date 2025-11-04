import React from "react";
import "./Loader.css";

const Loader = ({ message = "Redirecting" }) => {
  return (
    <div className="loader-container">
      <div className="loader-body">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1>{message}</h1>
    </div>
  );
};

export default Loader;
