import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {Home} from "./layouts/Homepage/Home";

export const App = () => {
  return (
      <div>
          <Navbar />
          <Home />
          <Footer />
      </div>

  );
}