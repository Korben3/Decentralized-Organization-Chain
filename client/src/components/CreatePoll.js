import React, { useState, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { nodes } from "../config/config.json";
import { AddPollTransaction } from "../transactions/add-poll_transaction";

const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");
const { APIClient } = require("@liskhq/lisk-api-client");
const passphrase = require("@liskhq/lisk-passphrase");
const cryptography = require("@liskhq/lisk-cryptography");

const CreatePoll = ({ loggedIn, showMessage, userInfo }) => {
  const [pollQuestion, setPollQuestion] = useState();
  const [pollAnswers, setPollAnswers] = useState({});
  const [voteMessage, setVoteMessage] = useState(
    "Please login to submit a poll."
  );
  const [enableVoteButton, setEnableVoteButton] = useState(false);

  const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
    return parseInt(inSeconds);
  };

  const client = new APIClient(nodes); // DOC SDK test server

  const addPoll = () => {
    const userPassphrase = sessionStorage.getItem("secret"); // retrieve passphrase

    // verify if fields are properly filled in
    if (
      !pollQuestion ||
      pollQuestion.length < 20 ||
      pollQuestion.length > 256
    ) {
      showMessage("Please write a proper question.", "warning");
    } else {
      // there is a question present what about enough valid answers?
      let pollAnswersTotal = Object.keys(pollAnswers).length;
      console.log(pollAnswersTotal);
      if (pollAnswersTotal < 2) {
        showMessage("Please write at least 2 answers.", "warning");
      } else {
        let badAnswer = false;
        const answers = Object.values(pollAnswers);
        for (const answer of answers) {
          if (answer.length < 2 || answer.length > 128) {
            badAnswer = true;
          }
        }
        if (badAnswer) {
          showMessage("Poll question missing or invalid.", "warning");
        } else {
          // setup connection, create and broadcast the tx

          // generate random address to add the poll
          const { Mnemonic } = passphrase;
          const pollPassphrase = Mnemonic.generateMnemonic();
          const pollAddress = cryptography.getAddressFromPassphrase(
            pollPassphrase
          );
          console.log(`New poll address: ${pollAddress}`);

          const tx = new AddPollTransaction({
            asset: {
              poll: {
                question: pollQuestion,
                answers: pollAnswers
              }
            },
            amount: 0,
            fee: `${transactions.utils.convertLSKToBeddows("1000")}`,
            recipientId: pollAddress,
            timestamp: getTimestamp()
          });

          tx.sign(userPassphrase);
          console.log(tx);

          client.transactions
            .broadcast(tx.toJSON())
            .then(res => {
              console.log(res.data.message);
              showMessage(
                "Poll added successfully! Check the Open polls on the Polls Overview page.",
                "success"
              );
            })
            .catch(res => {
              console.log("\nTransaction failed:");
              console.log(res);
              showMessage("Transaction failed", "warning");
            });
        }
      }
    }
  };

  const handleQuestionChange = data => {
    setPollQuestion(data.target.value.trim());
  };

  const handleAnswerChange = data => {
    if (!data.target.value) {
      delete pollAnswers[data.target.id]; // finally I get to use to the delete function!
    } else {
      pollAnswers[data.target.id] = data.target.value;
    }
    setPollAnswers(pollAnswers);
  };

  useEffect(() => {
    if (loggedIn) {
      if (userInfo?.asset?.user?.type === "board") {
        setEnableVoteButton(true);
      } else {
        setVoteMessage("Only board members are allowed to create a poll.");
        setEnableVoteButton(false);
      }
    }
  }, [loggedIn]);

  return (
    <div>
      <Card
        border="primary"
        className="Card mx-auto mb-4"
        style={{ width: "55vmax" }}
      >
        <Card.Header>Create a new poll</Card.Header>
        <Card.Body>
          <Card.Text>
            Fill in the fields below, at least two answers are required you can
            leave the other fields empty.
          </Card.Text>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Question:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="required"
              onChange={handleQuestionChange}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Answer 1:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="required"
              id="1"
              onChange={handleAnswerChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Answer 2:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="required"
              id="2"
              onChange={handleAnswerChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Answer 3:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="optional"
              id="3"
              onChange={handleAnswerChange}
            />
          </InputGroup>
          <InputGroup className="mb-4">
            <InputGroup.Prepend>
              <InputGroup.Text>Answer 4:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="optional"
              id="4"
              onChange={handleAnswerChange}
            />
          </InputGroup>
          <InputGroup className="mb-5">
            <InputGroup.Prepend>
              <InputGroup.Text>Answer 5:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="optional"
              id="5"
              onChange={handleAnswerChange}
            />
          </InputGroup>

          {enableVoteButton ? (
            <Button variant="primary" className="mt-3" onClick={addPoll}>
              Submit poll
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
                  Submit Poll
                </Button>
              </span>
            </OverlayTrigger>
          )}
          <Card.Text className="tm-4 text-right">
            <small className="text-muted">Poll fee: 1000 DOC</small>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
export default CreatePoll;
