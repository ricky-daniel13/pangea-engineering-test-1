import React, { useState, useEffect } from "react";
import "./NavBar.css";
import logo from "../globalAssets/platty.png";
import ppfLogo from "../globalAssets/ppfLogo.png";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/use-auth";
import routes from "../../Config/routes.js";

const Navbar = () => {
  const { getCurrrentUser, isAuthorized } = useAuth();

  const userInfo = getCurrrentUser();

  return (
    <div className="navbar">
      <div className="logo">
        <Link to={isAuthorized ? routes.dashboard : routes.home}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <Link
        to={routes.user}
        className="user"
        style={{ textDecoration: "none" }}
      >
        <div className="profile-photo">
          <img src={ppfLogo} alt="User Profile" />
        </div>
        <div className="user-tab">
          {/* Display user's full name and company name */}
          <div className="user-info">{`${userInfo?.first_name ?? ""} ${
            userInfo?.last_name ?? ""
          }`}</div>
          <div className="enterprise">{userInfo?.company_name ?? ""}</div>
        </div>
      </Link>
      <ul className="menu">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/campaigns">Campaigns</Link>
        </li>
        <li>
          <Link to="/blitzpay">Blitz Pay</Link>
        </li>
        <li>
          <Link to="/invoicing">Invoicing</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
