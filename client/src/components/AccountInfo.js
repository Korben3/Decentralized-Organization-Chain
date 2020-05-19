import React, { useState, useEffect } from "react";
import { getAccounts } from "../utils/tools";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams, NavLink } from "react-router-dom";
import * as transactions from "@liskhq/lisk-transactions";

const AccountInfo = ({ loggedIn }) => {
  let { address } = useParams();
  const [AccountInfo, setAccountInfo] = useState("");

  useEffect(() => {
    getAccounts({
      limit: 1,
      address: address
    })
      .then(res => {
        console.log("User account:");
        console.log(res.data);

        const userInfo = res.data[0];
        let balance = transactions.utils.convertBeddowsToLSK(userInfo.balance);
        const AddLink = loggedIn ? (
          <ListGroup.Item key="1">
            <NavLink to="/register" className="nav-link">
              Register as an investor or board member.
            </NavLink>
          </ListGroup.Item>
        ) : (
          ""
        );
        const AccountInfo = userInfo?.asset?.user?.name ? (
          <ListGroup variant="flush">
            <ListGroup.Item key="0">Balance: {balance} DOC</ListGroup.Item>
            <ListGroup.Item key="1">
              User name: {userInfo.asset.user.name}
            </ListGroup.Item>
            <ListGroup.Item key="2">
              User type: {userInfo.asset.user.type}
            </ListGroup.Item>
          </ListGroup>
        ) : (
          <ListGroup variant="flush">
            <ListGroup.Item key="0">Balance: {balance} DOC</ListGroup.Item>
            {AddLink}
          </ListGroup>
        );
        setAccountInfo(AccountInfo);
      })
      .catch(err => {
        console.log(err);
      });
  }, [address, loggedIn]);

  return (
    <div>
      <Card
        border="primary"
        className="Card mx-auto"
        style={{ width: "40rem" }}
        key={address}
      >
        <Card.Header>User account: {address}</Card.Header>
        <Card.Body>{AccountInfo}</Card.Body>
      </Card>
    </div>
  );
};
export default AccountInfo;
