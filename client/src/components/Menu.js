import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { defaultPassphrase } from "../config/config.json";

const Menu = ({ loggedIn, login, logout, userInfo }) => {
  const [userPassphrase, setUserPassphrase] = useState(defaultPassphrase);

  const handleChange = data => {
    setUserPassphrase(data.target.value.trim());
  };

  return (
    <Navbar bg="primary" variant="dark" className="mb-5" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to="/" className="nav-link text-light">
            Polls Overview
          </NavLink>
          <NavLink to="/create" className="nav-link text-light">
            Create Poll
          </NavLink>
          <NavLink to="/info" className="nav-link text-light">
            Information
          </NavLink>
          {loggedIn ? (
            <NavLink
              to={"/account/" + userInfo.address}
              className="nav-link text-light"
            >
              Account info
            </NavLink>
          ) : (
            ""
          )}
        </Nav>
        {!loggedIn ? (
          <Form inline className="hidden-sx">
            <Form.Control
              type="text"
              placeholder="DOC Passphrase"
              className="mr-sm-2"
              defaultValue={defaultPassphrase}
              onChange={handleChange}
            />
            <Button
              variant="outline-light"
              onClick={() => login(userPassphrase)}
            >
              Login
            </Button>
          </Form>
        ) : (
          <Navbar.Text className="nav-link text-light">
            Welcome user {userInfo?.asset?.user?.name} -{" "}
            <span onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </Navbar.Text>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
