import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";

import Login from "./scopes/Login/Login";

import "./App.css";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import TokenHandler from "./scopes/TokenHandler/TokenHandler";
import Trade from "./scopes/Trade/Trade";

// The famous nullable boolean we inherited from Java
type nullableBoolean = boolean | null;

function App() {
  const [connected, setConnected] = useState<nullableBoolean>(null);
  const { token, setToken } = useAppContext();

  useEffect(() => {
    fetch("http://localhost:8080/hello")
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h5>{`Can't stop, won't stop,`}</h5>
        <img
          src="https://cdn.worldvectorlogo.com/logos/gamestop.svg"
          className="App-logo"
          alt="logo"
        />
      </header>
      <Router>
        <Switch>
          <Route path="/login" component={Login}></Route>
          {token && (
            <>
              <Route path="/trade" component={Trade}></Route>
            </>
          )}
          <Route path="*" exact>
            <h1>
              API:
              {connected === true && " connected"}
              {connected === false && " not connected"}
            </h1>
            <Link className="login" to="/login">
              Login
            </Link>
          </Route>
        </Switch>
        <Route path="*" component={TokenHandler}></Route>
      </Router>
    </div>
  );
}
const WrappedApp = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default WrappedApp;
