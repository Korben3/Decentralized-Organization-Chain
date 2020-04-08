import React, { useState, useEffect } from "react";
import { getAccounts } from "../utils/tools";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams } from "react-router-dom";
import * as transactions from "@liskhq/lisk-transactions";

const AccountInfo = props => {
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
        const AccountInfo = (
          <div>
            <ListGroup.Item key="0">Balance: {balance} DOC</ListGroup.Item>
            <ListGroup.Item key="1">
              User name: {userInfo?.asset?.user?.name}
            </ListGroup.Item>
            <ListGroup.Item key="2">
              User type: {userInfo?.asset?.user?.type}
            </ListGroup.Item>
          </div>
        );
        setAccountInfo(AccountInfo);
      })
      .catch(err => {
        console.log(err);
      });
  }, [address]);

  return (
    <div>
      <Card
        border="primary"
        className="Card mx-auto"
        style={{ width: "40rem" }}
        key={address}
      >
        <Card.Header>User account: {address}</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">{AccountInfo}</ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};
export default AccountInfo;
