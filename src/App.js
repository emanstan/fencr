import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./scss/App.scss";
import CssBaseline from "@mui/material/CssBaseline";
import { AppContext } from "./components/Context";
import Header from "./components/Header";
import Users from  "./components/Users";
import Devices from  "./components/Devices";
import Matches from  "./components/Matches";
import Main from "./components/Main";
import logo from './logo.svg';
//import './App.css';

const App = () => {
    const { state } = useContext(AppContext);
    console.log("App created, ", state);
    return (
        <>
        <CssBaseline />
        <Header />
        {state.isAuth ? 
          <Router>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/matches" element={<Matches />} />
              <Route path='*' element={<Main />} />
            </Routes>
          </Router>
          :
          null
        }
        {/*state.isAuth ? <><NavBar /><Main /></> : ""*/}
        </>
    );
};

export default App;
