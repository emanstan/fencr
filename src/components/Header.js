import React, { useEffect, useContext } from "react";
//import reactDom from "react-dom";
import "../scss/Header.scss";
import { AppContext } from "../components/Context";
import logo from "../assets/cat-logo.svg";
//import { GoogleLogin, GoogleLogout } from "react-google-login";
import Button from '@mui/material/Button';
import { Link } from "@mui/material";
import Register from "./Register";
import SignIn from "./SignIn";

const Header = (props) => {
  const { state, dispatch } = useContext(AppContext);
  console.log(props, state);

  /*
  const gLogout = () => {
    async function clearToken() {
      const res = await fetch(process.env.REACT_APP_BACK + "/public/logout", {
        method: "POST",
        mode: "cors",
        cache: "default",
        credentials: "include"
      });
      return res;
    }
    clearToken()
      .then(dispatch({ type: "reset" }))
      .catch(err => console.error(err));
  };

  const gLogin = googleToken => {
    async function fetchToken() {
      const res = await fetch(process.env.REACT_APP_BACK + "/public/login", {
        method: "POST",
        headers: new Headers({
          Authorization: googleToken.tokenId,
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: "",
        mode: "cors",
        cache: "default",
        credentials: "include"
      });
      return res.json();
    }

    fetchToken()
      .then(auth => {
        if (auth.token) {
          dispatch({
            type: "set-app-context",
            payload: {
              isAuth: true,
              isRegistration: false,
              token: auth.token,
              email: auth.user.email,
              firstName: auth.user.firstName,
              lastName: auth.user.lastName,
            }
          });
        }
      })
      .catch(err => {
        console.error(err);
        dispatch({ type: "reset" });
      });
  };

  const gFailure = err => {
    console.error(err);
    dispatch({ type: "reset" });
  };
  */

  useEffect(() => {
    async function checkAuthStatus() {
      console.log("checkAuthStatus called, token =", state.token);
      const res = await fetch(
        state.api + "/users/refresh",
        {
          method: "POST",
          mode: "cors",
          cache: "default",
          credentials: "include"
        }
      );
      return res.json();
    }

    if (state.token === "") {
      checkAuthStatus()
        .then(auth => {
          if (auth.token) {
            dispatch({
              type: "set-app-context",
              payload: {
                isAuth: true,
                isRegistration: false,
                token: auth.token,
                email: auth.user.email,
                firstName: auth.user.firstName,
                lastName: auth.user.lastName,
              }
            });
          }
          else {
            dispatch({ type: "reset" });
          }
        })
        .catch(err => {
          console.error(err);
          dispatch({ type: "reset" });
        });
    }
  }, [state.api, state.token, dispatch]);

  const signOut = (event) => {
    dispatch({ type: "reset" });
  };

  return (
    <header className={state.isAuth ? "top" : "full"}>
      <div className="logo">
        <img alt="logo" src={logo} />
      </div>
      <h1 style={{ marginBottom: "0" }}>Fencr</h1>
      {state.isAuth ?
        <div className="menu">
          <Button variant="text" size="" color="primary" className="menu-item"><Link href="./users">Users</Link></Button>
          <Button variant="text" size="" color="primary" className="menu-item"><Link href="./devices">Devices</Link></Button>
          <Button variant="text" size="" color="primary" className="menu-item"><Link href="./matches">Matches</Link></Button>  
        </div>
        :
        null
      }
      {state.isAuth ?
        <div className="logout show">
          <h4>Hi, {state.firstName}</h4>
          <Button variant="contained" size="medium" color="primary" onClick={signOut}>Sign Out</Button>
          {/*
          <Button variant="contained" size="medium" color="primary">
            <Link href='/signout' style={{ color: "white" }}>Sign Out</Link>
          </Button>
          */}
          {/*
          <GoogleLogout
            buttonText="Logout"
            onLogoutSuccess={gLogout}
          />
          */}
        </div>
        :
        <div className="login show">
          {state.isRegistration ?
            <Register />
            :
            <SignIn />
          }
          {/*
          <GoogleLogin
            clientId={process.env.REACT_APP_GID}
            buttonText="Login"
            onSuccess={gLogin}
            onFailure={gFailure}
          />
          */}
        </div>
      }
    </header>
  );
};

export default Header;
