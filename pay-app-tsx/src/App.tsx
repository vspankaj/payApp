import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar/Navbar';
import Admin from './components/Pages/Admin';
import Payment from './components/Pages/Payment';

function App() {
  return (
    <>
      <div className="payment-background">
        <div className="left"></div>
        <div className="right">
          <div className="strip-bottom"></div>
          <div className="strip-top"></div>
        </div>
      </div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Payment />} />
          {/* <Route path="/Admin" element={<Admin />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
