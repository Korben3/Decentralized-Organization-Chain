import React, { useState, useEffect } from "react";
import { getAccounts } from "../utils/tools";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useParams } from "react-router-dom";
import { maxPollTime, nodes } from "../config/config.json";
import { CastVoteTransaction } from "../transactions/cast-vote_transaction";

const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");
const { APIClient } = require("@liskhq/lisk-api-client");

const PollsDetail = ({ loggedIn, showMessage }) => {
  let { address } = useParams();
  const [pollQuestion, setPollQuestion] = useState();
  const [pollAnswers, setPollAnswers] = useState();
  const [pollTimestamp, setPollTimestamp] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [pollAnswerSelected, setPollAnswerSelected] = useState(99);
  const [voteMessage, setVoteMessage] = useState("Please login to vote.");
  const [enableVoteButton, setEnableVoteButton] = useState(false);

  const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
    return parseInt(inSeconds);
  };

  const client = new APIClient(nodes); // Connect to the DOC SDK test server

  const pollVote = () => {
    console.log("voting");
    const userPassphrase = sessionStorage.getItem("secret");

    if (pollAnswerSelected > 5) {
      showMessage("Please select an answer.", "warning");
    } else {
      // setup connection, create and broadcast the tx
      const tx = new CastVoteTransaction({
        asset: {
          vote: pollAnswerSelected
        },
        amount: 0,
        fee: `${transactions.utils.convertLSKToBeddows("100")}`,
        recipientId: address,
        timestamp: getTimestamp()
      });

      tx.sign(userPassphrase);
      console.log(tx);

      client.transactions
        .broadcast(tx.toJSON())
        .then(res => {
          console.log(res.data.message);
          showMessage(
            "Voted successfully! Refresh the page to see the results.",
            "success"
          );
        })
        .catch(res => {
          console.log("\nTransaction failed:");
          console.log(res);
          showMessage("Transaction failed", "warning");
        });
    }
  };

  const handleChange = option => {
    console.log(`new option ${option}`);
    setPollAnswerSelected(option);
  };

  useEffect(() => {
    getAccounts({
      limit: 1,
      address: address
    })
      .then(res => {
        console.log("Poll account:");

        let { poll } = res.data[0].asset;
        console.log(poll);
        setPollQuestion(poll.question);
        let pollTimestamp = res.data[0].asset.timestamp;
        setPollTimestamp(pollTimestamp);

        // calculate number of votes
        console.log(poll.votes);
        let totalVotes = 0;
        if (poll.votes) {
          Object.values(poll.votes).map(data => (totalVotes += data));
        } else {
          poll.votes = 0; // no votes yet, set to 0
        }
        const answers = Object.values(poll.answers).map((data, index) => (
          <ListGroup.Item key={index}>
            <InputGroup.Prepend>
              <InputGroup.Radio
                name="answer"
                size="sm"
                onChange={() => handleChange(index + 1)}
              />{" "}
              <span className="text-muted">&nbsp; Answer {index + 1}</span>
            </InputGroup.Prepend>
            {data}
            <ProgressBar
              now={(poll.votes[index + 1] / totalVotes) * 100}
              label={
                poll.votes[index + 1]
                  ? `${poll.votes[index + 1]} votes`
                  : `0 votes`
              }
              className="mt-2"
            />
          </ListGroup.Item>
        ));
        setPollAnswers(answers);

        // calculate time left or show poll closed showMessage
        let currentTimestamp = getTimestamp();
        console.log(`current timestamp: ${currentTimestamp}`);
        if (currentTimestamp - pollTimestamp > maxPollTime) {
          setTimeLeft("Poll closed");
        } else {
          let secondsLeft = maxPollTime - (currentTimestamp - pollTimestamp);
          let days = Math.floor(secondsLeft / 3600 / 24);
          let hours = Math.floor((secondsLeft / 3600) % 24);
          let minutes = Math.floor((secondsLeft % 3600) / 60);
          setTimeLeft(
            `${days} day(s), ${hours} hour(s) and ${minutes} minutes left.`
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [address]);

  useEffect(() => {
    let currentTimestamp = getTimestamp();
    console.log(`poll timestamp: ${pollTimestamp}`);

    if (loggedIn) {
      if (currentTimestamp - pollTimestamp < maxPollTime) {
        setEnableVoteButton(true);
      } else {
        setVoteMessage("Poll closed.");
        setEnableVoteButton(false);
      }
    }
  }, [loggedIn, pollTimestamp]);

  return (
    <div>
      <Card
        border="primary"
        className="Card mx-auto mb-4"
        style={{ width: "55vmax" }}
        key={address}
      >
        <Card.Header>
          Poll: {address}
          <br />
          <small className="text-muted">{timeLeft}</small>
        </Card.Header>
        <Card.Body>
          <Card.Title>Question:</Card.Title>
          <Card.Text>{pollQuestion}</Card.Text>
          <ListGroup variant="flush">{pollAnswers}</ListGroup>
          {enableVoteButton ? (
            <Button variant="primary" className="mt-3" onClick={pollVote}>
              Vote
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
                  Vote
                </Button>
              </span>
            </OverlayTrigger>
          )}
          <Card.Text className="mt-3 text-right">
            <small className="text-muted">Vote fee: 100 DOC</small>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
export default PollsDetail;
