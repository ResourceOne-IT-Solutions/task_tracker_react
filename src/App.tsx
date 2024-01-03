import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Homepage';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/login/:name" element={<Login/>}></Route> 
    </Routes>
  </BrowserRouter>
    </div>
  );
}

export default App;
