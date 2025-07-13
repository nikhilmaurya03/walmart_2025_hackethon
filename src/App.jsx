import React from "react";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Content from "./components/Content";
import Alerts from "./components/Alert";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const App=()=>{
   return(
    <Router>
      <Header />
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Router>
   )
}
export default App
