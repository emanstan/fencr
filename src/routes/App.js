import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./scss/App.scss";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AppContext } from "../components/Context";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Main from "../components/Main";
import Footer from "../components/Footer";

/*** IMPORTANT: This is not the one we're using. SEE THE OTHER App.js ***/

const App = () => {
  const { state } = useContext(AppContext);
  return (
    <>
      <CssBaseline />
      <Header />
      {state.isAuth ? 
        <Router>
          <NavBar />
          <Switch>
            <Route path="/signout">
              <SignOut />
            </Route>
            <Route path='*'>
              <Main />
            </Route>
          </Switch>
        </Router>
        :
        {}
      }
      <Footer />
    </>
  );
};

export default App;
