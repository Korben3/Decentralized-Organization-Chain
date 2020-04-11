import React from "react";
import "./Info.css";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";

import viewPolls from "../assets/viewPolls.png";
import login from "../assets/login.png";
import accountInfo from "../assets/accountInfo.png";
import pollDetail from "../assets/pollDetail.png";
import newPoll from "../assets/newPoll.png";

const Info = () => {
  return (
    <div className="info">
      <h2>Decentralized Organization Chain</h2>
      <h4>Description</h4>
      <p>
        One of the challenges of new startups is to get initial funding which is
        needed for rent, equipment, salaries. Decentralized Organization Chain
        (DOC) allows companies to start their own company blockchain and receive
        funding by selling tokens to Investors. Investors in turn have a chance
        to make and influence company decisions by creating polls or run a
        forging node creating a Decentralized chain and earning rewards. Anyone
        who bought enough tokens can become a board member and create polls. And
        token holders can register themselves as investors so they're able to
        vote on polls. After the poll is ended, the company is expected to
        follow the most voted answer.
        <br />
        <br />
        <b>Example:</b>
        <br />
        New poll: <i>Should we hire 2 additional R&D employees?</i>
        <br />
        Options:<i> [Yes] [No]</i>
      </p>
      <p>
        The DOC application is build with the{" "}
        <a href="https://lisk.io/">Lisk SDK</a> and consists of a server and
        client part, both are written in Javascript. The server runs the actual
        blockchain using NodeJS and a PostgreSQL database. The client part acts
        as an interface to the server and is build using NodeJS, React,
        bootstrap and Lisk Elements.
        <br />
        For a more in depth overview of the Lisk SDK check out the{" "}
        <a href="https://lisk.io/documentation/lisk-sdk/index.html">
          Lisk SDK documentation
        </a>
        .
      </p>
      <h4>Rules</h4>
      <p>The following rules are part of DOC:</p>
      <ul>
        <li>
          Founders hold a significant amount of tokens, which can also partly be
          used for future funding of the company.
        </li>
        <li>
          Initial Token Offering (ITO) allows interested parties to invest in
          the startup company and even take a board member position.
        </li>
        <li>
          Quarterly profit is used to buy back and then burn Security tokens
          from the exchanges, increasing the token price for investors and also
          decreasing the existing amount of tokens.
        </li>
        <li>
          After a poll ends the company must follow the most voted decision.
        </li>
      </ul>
      <p>
        If the above rules are violated than it will result in investors losing
        faith, selling their tokens and decreasing the value of the Founders
        tokens.
      </p>
      <h4>Usage</h4>
      <h5>View polls</h5>
      <p>
        You can find all polls by clicking on Polls Overview in the menu on the
        top left of the page. From there look through the different pages or
        filter to view All pols, the Open polls or Closed polls.
      </p>
      <Image src={viewPolls} rounded />
      <p>
        To vote on a poll, goto Open polls and click on a poll question. This
        will take you to the Polls detail page. You can even share the link to
        the poll by copying the url, for example{" "}
        <a href="http://localhost:3000/poll/2640854792302334037L">
          doc.korben3.com/poll/2640854792302334037L
        </a>
        .
      </p>
      <h5>Login</h5>
      <p>
        Before you can create a poll, you first have to login. Goto the top
        right and enter a valid passphrase for the Decentralized Organization
        Chain or use the already filled in passphrase. This one belongs to an
        investor and allows you to vote. Then click the Login button.
      </p>
      <Image src={login} rounded />
      <p>
        After you login an extra menu option appears called Account Info. Here
        you can check how many DOC tokens the account holds and if it's
        registered as an investor or board member. Depending on your user type
        you can only vote or vote and create new polls.
      </p>
      <Image src={accountInfo} rounded />
      <h5>Vote on a poll</h5>
      <p>
        To vote on a poll select one from the Open polls which you can find in
        the Polls Overview. Read the question and click on the circle option
        before the answer you would like to choose. Then click on the Vote
        button. Remember to vote you first must login, have enough balance and
        are registered as an investor or board member.
      </p>
      <Image src={pollDetail} rounded />
      <h5>Create new poll</h5>
      <p>
        To create a new poll you first must be registered as a board member. If
        you want to try it out just ask korben3 on Discord or Telegram for an
        account. Goto Create Poll and fill in a good business related question
        and at least 2 answers. Be sure to review the poll and then click on the
        Submit Poll button. It will create the poll on an unique address. You
        can find the created poll by going to Polls Overview and selecting Open
        polls. Click on the poll and copy the url to share it with others.
      </p>
      <Image src={newPoll} rounded />
      <h4>Custom transactions</h4>
      <p>The following custom transactions are used:</p>
      <Table
        bordered
        striped
        hover
        size="sm"
        variant="dark"
        className="tableTX"
        responsive="sm"
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Description</th>
            <th>Fee (DOC)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>101</td>
            <td>RegisterInvestorTransaction</td>
            <td>Register as an investor.</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>102</td>
            <td>RegisterBoardMemberTransaction</td>
            <td>Register as a board member.</td>
            <td>100000</td>
          </tr>
          <tr>
            <td>103</td>
            <td>AddPollTransaction</td>
            <td>Add a new poll.</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>104</td>
            <td>CastVoteTransaction</td>
            <td>Cast a vote.</td>
            <td>100</td>
          </tr>
        </tbody>
      </Table>
      <p>
        You can find the source code can be found on github:{" "}
        <a href="https://github.com/Korben3/Decentralized-Organization-Chain">
          Github - korben3 - Decentralized Organization Chain
        </a>
      </p>
      <h5>Register as investor</h5>
      <p>
        Filename: <i>register-investor_transaction.js</i>
        <br />
        <br />
        This transaction allows token owners to register themselves as an
        investor. Investors are able to vote on polls created by board members.
        The fee is set to 1000 DOC so the threshold to participate is low.
      </p>
      <p>
        In the validateAsset() method we make sure the transaction conforms to
        the following rules:
        <br />
        - The user.name property is present and equal or smaller than 32
        characters
        <br />
        - The user.type property is present and the value is set to "investor"
        <br />
        - The transaction contains only 1 asset object and only 2 user
        properties
        <br />
        <br />
        Below is the code that makes sure the user.type is set to "investor" or
        else it will throw an error.
        <br />
      </p>
      <pre className="tableTX">
        <code className="language-js">
          {`if (!user.type || user.type !== "investor") {
    errors.push(
        new TransactionError("Invalid user type for this transaction.")
    );
}`}
        </code>
      </pre>
      <p>
        After the transaction (tx) is validated, the investor type will be
        applied to the users account. And the user will be allowed to vote on a
        poll.
      </p>
      <h5>Register as a board member</h5>
      <p>
        Filename: <i>register-board-member_transaction.js</i>
        <br />
        <br />
        Registering as a board member costs 100000 DOC, an intended high fee
        because members are allowed to create new polls changing the direction
        of the company. Both the company and investors benefit from good
        decisions, so any new poll is taking very seriously. Board members are
        also allowed to vote.
      </p>
      <h5>Add new poll</h5>
      <p>
        Filename: <i>add-poll_transaction.js</i>
        <br />
        <br />
        With this transaction board members can create new polls for 1000 DOC. A
        poll is open for 7 days after which it's not possible to vote on any of
        the answers. When the poll closes the company is expected to follow the
        result, which is the answer with the highest votes. If the company
        decides to ignore the result, it will decrease trust and investors might
        decide to sell large parts of their tokens, decreasing the value.
      </p>
      <p>
        The poll transaction code performs various checks to make sure valid
        polls are submitted:
        <br />
        <br />
        - A Question must be present and of correct length.
        <br />
        - At least 2 and a maximum of 5 answers are allowed and must be of
        correct length.
        <br />
        - No cheating allowed, so it cannot start with votes present.
        <br />
        - The sender must be registered as a board member.
        <br />
        - If the poll address already contains a poll. Overwriting is not
        allowed.
        <br />
        <br />
        For example, the following code checks if the sender is registered as a
        board member.
      </p>
      <pre className="tableTX">
        <code className="language-js">
          {`if (sender.asset.user.type !== "board") {
    errors.push(
        new TransactionError("Sender is not registered as a board member.")
    );
}`}
        </code>
      </pre>

      <h5>Cast vote</h5>
      <p>
        Filename: <i>cast-vote_transaction.js</i>
        <br />
        <br />
        Token owners registered as investors or board members are able to vote
        on any open poll. One vote costs 100 DOC tokens. Multiple votes on an
        answer are allowed because this shows that someone is willing to spend a
        lot of tokens to make a certain decision. Token holders only benefit of
        good decisions, so any vote is considered carefully.
        <br />
        After the poll closes it's not possible to vote any more and the vote is
        rejected by the blockchain.
      </p>
      <p>
        The cast vote transaction checks if the vote asset is valid, if the poll
        is still open and if the sender is registered as a board member or
        investor.
        <br />
        <br />
        The code below in the applyAsset method adds the vote.
        <br />
        <br />
        - If there are no votes it simply adds a new vote asset with the first
        vote of the sender.
        <br />
        - If the answer is already voted on it increases the vote count of that
        answer.
        <br />
        - If there are already votes but this is a new answer, it stores all the
        previous votes and adds the new answer with a value of 1.
        <br />
      </p>
      <pre className="tableTX">
        <code className="language-js">
          {`if (recipient.asset.poll.votes) {
    let votes = recipient.asset.poll.votes;
    if (votes[vote]) {
        ++votes[vote];
        recipient.asset.poll.votes = votes;
    } else {
        recipient.asset.poll.votes = { ...votes, [vote]: 1 };
    }
} else {
    recipient.asset.poll.votes = { [vote]: 1 };
}

store.account.set(recipient.address, recipient);`}
        </code>
      </pre>
      <h4>API</h4>
      <p>
        The public API is available at: 167.179.98.242:4000. For a list of
        available endpoints see the{" "}
        <a href="https://lisk.io/documentation/lisk-sdk/reference/api.html">
          API documentation
        </a>{" "}
        on Lisk.io
        <br />
        <br />
        Example calls:
        <br />
        Retrieve balance of an account:{" "}
        <a href="http://167.179.98.242:4000/api/accounts?address=10572594784286738319L">
          http://167.179.98.242:4000/api/accounts?address=10572594784286738319L
        </a>
        <br />
        See the status of the node:{" "}
        <a href="http://167.179.98.242:4000/api/node/status">
          http://167.179.98.242:4000/api/node/status
        </a>
        <br />
      </p>
      <h4>Credit</h4>
      <p>
        <i>
          Decentralized Organization Chain is a Proof of Concept created with
          the Lisk Framework by Lisk delegate korben3.
        </i>
      </p>
    </div>
  );
};

export default Info;
