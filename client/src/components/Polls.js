import React from "react";
import PollCard from "../components/PollCard";
import CardColumns from "react-bootstrap/CardColumns";
import Spinner from "react-bootstrap/Spinner";

const Polls = ({ polls, loading }) => {
  if (loading) {
    return (
      <div className="row justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  } else {
    const pollsFormatted = polls.map(data => (
      <PollCard
        address={data.address}
        question={data.asset.poll.question}
        key={data.address}
      />
    ));

    return <CardColumns className="m-4">{pollsFormatted}</CardColumns>;
  }
};

export default Polls;
