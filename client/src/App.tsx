import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";

import Login from "./scopes/Login/Login";

import { AppProvider, useAppContext } from "./contexts/AppContext";
import ContextHandler from "./scopes/ContextHandler/ContextHandler";
import Trade from "./scopes/Trade/Trade";
import { Container, Stack, styled } from "@mui/material";

// The famous nullable boolean we inherited from Java
type nullableBoolean = boolean | null;

const Logo = styled("img")({
  height: "100px",
  maxWidth: "50%",
  "pointer-events": "none",
});

export const serverHost = process.env.SERVER_HOST
  ? `${process.env.SERVER_HOST}:8080`
  : "http://0.0.0.0:8080";

function App() {
  const [connected, setConnected] = useState<nullableBoolean>(null);
  const { token, setToken } = useAppContext();

  useEffect(() => {
    fetch(`${serverHost}/hello`)
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  return (
    <>
      <Stack
        color="white"
        alignItems="center"
        justifyContent="center"
        minHeight="20vh"
        sx={{ background: "#282c34" }}
      >
        <h5>{`Can't stop, won't stop,`}</h5>
        <Logo
          src="https://cdn.worldvectorlogo.com/logos/gamestop.svg"
          alt="logo"
        />
      </Stack>
      <Container>
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
          <Route path="*" component={ContextHandler}></Route>
        </Router>
      </Container>
    </>
  );
}
const WrappedApp = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default WrappedApp;
