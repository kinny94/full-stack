import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {Home} from "./layouts/Homepage/Home";
import {Search} from "./layouts/Search/Search";
import {Route, Routes} from "react-router-dom";

export const App = () => {
  return (
      <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
              <Routes>
                  <Route path="/home"  element={<Home />} />
                  <Route path="/search" element={<Search />} />
              </Routes>
          </div>
          <Footer />
      </div>

  );
}