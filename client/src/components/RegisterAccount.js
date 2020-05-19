import React, { useState, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { nodes } from "../config/config.json";
import { RegisterBoardMemberTransaction } from "../transactions/register-board-member_transaction";
import { RegisterInvestorTransaction } from "../transactions/register-investor_transaction";

const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");
const { APIClient } = require("@liskhq/lisk-api-client");

const RegisterAccount = ({ loggedIn, showMessage, userInfo }) => {
  const [voteMessage, setVoteMessage] = useState(
    "Please login to register your account."
  );
  const [enableVoteButton, setEnableVoteButton] = useState(false);
  const [userName, setUserName] = useState("");
  const [typeSelected, setTypeSelected] = useState(99);

  const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
    return parseInt(inSeconds);
  };

  const client = new APIClient(nodes); // DOC SDK test server

  const register = () => {
    const userPassphrase = sessionStorage.getItem("secret"); // retrieve passphrase

    // verify if fields are properly filled in
    if (!userName || userName.length > 32) {
      showMessage("Please enter a username (max 32 characters).", "warning");
    } else {
      if (typeSelected > 1) {
        showMessage("Please select a user type.", "warning");
      } else if (typeSelected === 0) {
        console.log("Registering as an investor.");

        const tx = new RegisterInvestorTransaction({
          asset: {
            user: {
              name: userName,
              type: "investor"
            }
          },
          amount: 0,
          fee: `${transactions.utils.convertLSKToBeddows("1000")}`,
          recipientId: "123L",
          timestamp: getTimestamp()
        });

        tx.sign(userPassphrase);

        client.transactions
          .broadcast(tx.toJSON())
          .then(res => {
            showMessage(
              "User successfully registered as an investor.",
              "success"
            );
            setEnableVoteButton(false);
            setVoteMessage("Account already registered as an investor.");
          })
          .catch(res => {
            console.log(res);
            showMessage(
              "Transaction failed, balance low or already registered.",
              "warning"
            );
          });
      } else if (typeSelected === 1) {
        console.log("Registering as a board member.");

        const tx = new RegisterBoardMemberTransaction({
          asset: {
            user: {
              name: userName,
              type: "board"
            }
          },
          amount: 0,
          fee: `${transactions.utils.convertLSKToBeddows("100000")}`,
          recipientId: "123L",
          timestamp: getTimestamp()
        });

        tx.sign(userPassphrase);

        client.transactions
          .broadcast(tx.toJSON())
          .then(res => {
            showMessage(
              "User successfully registered as a board member.",
              "success"
            );
            setEnableVoteButton(false);
            setVoteMessage("Account already registered as a board member.");
          })
          .catch(res => {
            console.log(res);
            showMessage(
              "Transaction failed, balance low or already registered.",
              "warning"
            );
          });
      }
    }
  };

  const handleUserNameChange = data => {
    setUserName(data.target.value.trim());
  };

  const handleChange = option => {
    console.log(`new option ${option}`);
    setTypeSelected(option);
  };

  useEffect(() => {
    if (loggedIn) {
      if (userInfo?.asset?.user?.type) {
        setEnableVoteButton(false);
        setVoteMessage(
          `Account already registered as ${userInfo?.asset?.user?.type}.`
        );
      } else {
        setEnableVoteButton(true);
      }
    } else {
      setEnableVoteButton(false);
      setVoteMessage("Please login to register your account.");
    }
  }, [loggedIn]);

  return (
    <div>
      <Card
        border="primary"
        className="Card mx-auto mb-4"
        style={{ width: "55vmax" }}
      >
        <Card.Header>Register as investor or board member</Card.Header>
        <Card.Body>
          <Card.Text>
            Fill in a username, and select if you want to register as an
            investor (able to vote) or a board member (able to create polls and
            vote).
          </Card.Text>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Username:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter a username"
              onChange={handleUserNameChange}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Radio
                name="type"
                size="sm"
                onChange={() => handleChange(0)}
              />
              &nbsp; Investor&nbsp;
              <small className="text-muted">fee: 1000 DOC</small>
            </InputGroup.Prepend>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Radio
                name="type"
                size="sm"
                onChange={() => handleChange(1)}
              />
              &nbsp; Board member&nbsp;
              <small className="text-muted">fee: 100000 DOC</small>
            </InputGroup.Prepend>
          </InputGroup>

          {enableVoteButton ? (
            <Button variant="primary" className="mt-3" onClick={register}>
              Register Account
            </Button>
          ) : (
            <OverlayTrigger
              key="1"
              placement="right"
              overlay={<Tooltip id="warning">{voteMessage}</Tooltip>}
            >
              <span className="d-inline-block">
                <Button
                  variant="primary"
                  className="mt-3"
                  disabled
                  style={{ pointerEvents: "none" }}
                >
                  Register Account
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
export default RegisterAccount;
