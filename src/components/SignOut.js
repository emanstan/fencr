import React, { useContext } from "react";
import { AppContext } from "../components/Context";
import { useNavigate } from "react-router-dom";

const SignOut = (props) => {
  console.log(props);
  const { state, dispatch } = useContext(AppContext);

  const navigate = useNavigate();

  const signOut = () => {
    dispatch({ type: "reset" });
    navigate("/signin");
  };

  return (<div />);
}

export default SignOut;