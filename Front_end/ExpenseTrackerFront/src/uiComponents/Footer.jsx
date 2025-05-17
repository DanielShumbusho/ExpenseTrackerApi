import React from "react";

const Footer = () => {
  return (
    <footer className="row-span-1 col-span-20 bg-gray flex justify-center items-center">
      © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
    </footer>
  );
};

export default Footer;
