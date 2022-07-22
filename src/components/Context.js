import React, { createContext, useReducer } from "react";

let AppContext = createContext();

let initialState = {
  //api: "https://" + process.env.API_HOST + (process.env.API_PORT ? ":" + process.env.API_PORT : "") + process.env.API_BASE_ROUTE,
  //api: "http://localhost:5000/api/latest",
  api: process.env.REACT_APP_API,
  isAuth: false,
  isRegistration: false,
  token: "",
  email: "",
  firstName: "",
  lastName: "",
};

let reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "set-app-context":
      return {
        ...state,
        isAuth: action.payload.isAuth,
        isRegistration: action.payload.isRegistration,
        token: action.payload.token,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
    case "set-registration":
      return {
        ...state,
        isRegistration: action.payload.isRegistration,
      };
    default:
      return initialState;
  }
};

const AppContextProvider = ({ children }) => {
  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
