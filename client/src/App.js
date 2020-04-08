import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Menu from "./components/Menu";
import PollsDetail from "./components/PollsDetail";
import { getAccounts } from "./utils/tools";
import { credit } from "./config/config.json";
import Info from "./components/Info";
import CreatePoll from "./components/CreatePoll";
import PollsOverview from "./components/PollsOverview";
import AccountInfo from "./components/AccountInfo";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as cryptography from "@liskhq/lisk-cryptography";
import Alert from "react-bootstrap/Alert";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("secret")) {
      const userPassphrase = sessionStorage.getItem("secret");
      const userAddress = cryptography.getAddressFromPassphrase(userPassphrase);

      console.log(`returning: ${userPassphrase} - ${userAddress}`);
      getAccounts({
        limit: 1,
        address: userAddress
      })
        .then(res => {
          const userInfo = res.data[0];
          setUserInfo(userInfo);
          setLoggedIn(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
    console.log(credit);
  }, []);

  const showMessage = (message, variant) => {
    const alert = (
      <Alert key="alert1" variant={variant}>
        {message}
      </Alert>
    );

    setMessage(alert);
    setTimeout(hideMessage, 6000);
  };

  const hideMessage = () => {
    setMessage("");
  };

  const login = userPassphrase => {
    const userAddress = cryptography.getAddressFromPassphrase(userPassphrase);

    console.log(`logging in: ${userPassphrase} - ${userAddress}`);
    getAccounts({
      limit: 1,
      address: userAddress
    })
      .then(res => {
        if (res.data.length) {
          const userInfo = res.data[0];
          setUserInfo(userInfo);
          console.log(userInfo);
          setLoggedIn(true);
          sessionStorage.setItem("secret", userPassphrase);
        } else {
          showMessage("No valid account found, check passphrase.", "warning");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const logout = () => {
    console.log("logging out..");
    sessionStorage.removeItem("secret");
    setLoggedIn(false);
  };

  return (
    <div>
      <Header />
      <Router>
        <Menu
          loggedIn={loggedIn}
          login={login}
          logout={logout}
          userInfo={userInfo}
        />
        {message}
        <Switch>
          <Route
            path="/create"
            render={props => (
              <CreatePoll
                {...props}
                loggedIn={loggedIn}
                showMessage={showMessage}
                userInfo={userInfo}
              />
            )}
          />
          <Route path="/info" component={Info} />
          <Route
            path="/poll/:address"
            render={props => (
              <PollsDetail
                {...props}
                loggedIn={loggedIn}
                showMessage={showMessage}
              />
            )}
          />
          <Route path="/account/:address" component={AccountInfo} />
          <Route path="/" component={PollsOverview} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
