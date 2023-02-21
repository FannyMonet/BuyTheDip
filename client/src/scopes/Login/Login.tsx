import React, { useState } from "react";
import { useHistory } from "react-router";
import { serverHost } from "../../App";

import "./Login.css";

export default function Login() {
  const history = useHistory();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = (username: string, password: string) =>
    fetch(`${serverHost}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json();
        }
        throw res.status === 400
          ? "Username or password invalid"
          : "Internal server error";
      })
      .then((res) => {
        if (res.body.token) {
          history.push(`/trade?token=${res.body?.token}&username=${username}`);
        } else {
          throw new Error("Internal server error");
        }
      })
      .catch((err) => {
        setErrorMessage(err);
      });

  return (
    <div className="Login">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (username === null) {
            setErrorMessage("Enter username");
          } else if (password === null) {
            setErrorMessage("Enter password");
          } else {
            login(username, password);
          }
        }}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username ?? ""}
          onChange={({ target: { value } }) => setUsername(value)}
        />
        <label htmlFor="username">Password</label>
        <input
          id="password"
          type="password"
          value={password ?? ""}
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <button type="submit">Login</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
}
