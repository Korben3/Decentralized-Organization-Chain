import React from "react";
import Card from "react-bootstrap/Card";
import { NavLink } from "react-router-dom";

const PollCard = props => {
  let pollAddress = "/poll/" + props.address;

  return (
    <Card border="primary" className="Card" key={props.address}>
      <Card.Header>Poll: {props.address}</Card.Header>
      <Card.Body>
        <NavLink to={pollAddress} className="nav-link">
          <Card.Title>Question:</Card.Title>
          <Card.Text>{props.question}</Card.Text>
        </NavLink>
      </Card.Body>
    </Card>
  );
};
export default PollCard;
