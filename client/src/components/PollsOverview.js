import React, { useEffect, useState } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import "./PollsOverview.css";
import { getAccounts } from "../utils/tools";
import Polls from "../components/Polls";
import PageNav from "../components/PageNav";
import { EPOCH_TIME } from "@liskhq/lisk-constants";
import { maxPollTime } from "../config/config.json";

const PollsOverview = () => {
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState([true, false, false]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 6;

  const getTimestamp = () => {
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
    return parseInt(inSeconds);
  };

  const getPolls = status => {
    console.log(`getPolls ${status}`);
    setLoading(true);

    getAccounts({
      limit: 100
    })
      .then(res => {
        console.log("Poll accounts:");
        console.log(res.data);

        let polls = res.data.filter(item => item.asset.poll); // filter, only accounts with poll asset
        console.log(polls);
        let activePoll = [true, false, false];
        // filter, show only open or closed polls
        if (status === "open") {
          let currentTimestamp = getTimestamp();
          polls = polls.filter(
            item => currentTimestamp - item.asset.timestamp < maxPollTime
          );
          activePoll = [false, true, false];
        } else if (status === "closed") {
          let currentTimestamp = getTimestamp();
          polls = polls.filter(
            item => currentTimestamp - item.asset.timestamp >= maxPollTime
          );
          activePoll = [false, false, true];
        }
        // var result = numbers.filter(number => number > 5);

        // polls = polls.reverse();
        setPolls(polls);
        setActivePoll(activePoll);
        setLoading(false);
        console.log(`total polls ${polls.length}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPolls("all");
  }, []);

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);

  const gotoPage = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <ButtonToolbar className="mb-3 justify-content-center">
        <ButtonGroup className="mr-2">
          <Button
            variant="primary"
            active={activePoll[0]}
            onClick={() => getPolls("all")}
          >
            All polls
          </Button>
          <Button
            variant="primary"
            active={activePoll[1]}
            onClick={() => getPolls("open")}
          >
            Open polls
          </Button>
          <Button
            variant="primary"
            active={activePoll[2]}
            onClick={() => getPolls("closed")}
          >
            Closed polls
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <Polls polls={currentPolls} loading={loading} />
      <PageNav
        pollsPerPage={pollsPerPage}
        totalPolls={polls.length}
        currentPage={currentPage}
        gotoPage={gotoPage}
      />
    </div>
  );
};
export default PollsOverview;
