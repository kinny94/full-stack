import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {Home} from "./layouts/Homepage/Home";
import {Search} from "./layouts/Search/Search";

export const App = () => {
  return (
      <div>
          <Navbar />
          {/*<Home />*/}
          <Search />
          <Footer />
      </div>

  );
}