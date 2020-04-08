import React from "react";
import "./Header.css";
import liskLogo from "../assets/liskLogo-small.png";

const Header = () => {
  return (
    <div>
      <h2 className="Header">
        <img src={liskLogo} alt="Lisk logo" />
        &nbsp;Decentralized Organization Chain
      </h2>
    </div>
  );
};
export default Header;
