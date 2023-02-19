import React, { createContext, useContext, useReducer } from "react";
import { ActionTypes } from "./actions";

type Actions<T> = {
  type: T;
  payload?: any;
  meta?: any;
};

interface IAppState {
  token: string | null;
  username: string | null;
}

interface IAppContext {
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
}

const initialState: IAppState = {
  token: null,
  username: null,
};

const AppContext = createContext<IAppState & IAppContext>({
  ...initialState,
  setToken: () => {},
  setUsername: () => {},
});

export const AppReducer = (state: IAppState, action: Actions<ActionTypes>) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return { ...state, token: action?.payload };
    case ActionTypes.SET_USERNAME:
      return { ...state, username: action?.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setToken: (token) =>
          setImmediate(() =>
            dispatch({ type: ActionTypes.SET_TOKEN, payload: token })
          ),
        setUsername: (username) =>
          setImmediate(() =>
            dispatch({ type: ActionTypes.SET_USERNAME, payload: username })
          ),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
