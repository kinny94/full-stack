import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {ExplorePage} from "./layouts/Homepage/ExplorePage";
import {Carousel} from "./layouts/Homepage/Carousel";

function App() {
  return (
      <div>
          <Navbar />
          <ExplorePage/>
          <Carousel />
      </div>

  );
}

export default App;
