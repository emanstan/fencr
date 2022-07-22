import React from "react";

const Footer = props => {

  const year = new Date().getFullYear();
  console.log("year =", year);

  return (
    <footer style={{ margin: "-20px 0 0 0" }}>
      <small>&copy; Copyright {new Date().getFullYear()}, Eric Stanfield. All rights reserved.</small>
    </footer>
  );
};

export default Footer;
