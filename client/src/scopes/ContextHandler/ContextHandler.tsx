import { useLocation } from "react-router";

import { useAppContext } from "../../contexts/AppContext";

export default function ContextHandler() {
  const { token, setToken, setUsername } = useAppContext();
  const location = useLocation();

  if (token) {
    return null;
  }

  const matched = /(?:\?|&)token=(?<token>[^=&]*)(?:&?)(?:username=)(?<username>[^=&]*)(?:&?)/gi.exec(
    location.search
  )?.groups;

  if (matched?.token) {
    setToken(matched.token);
  }
  if (matched?.username) {
    setUsername(matched.username);
  }

  return null;
}
