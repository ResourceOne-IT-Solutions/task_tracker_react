import React from 'react';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login/:name' element={<Login/>}/>
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
        </Routes>
      </BrowserRouter>
      {/* <h1>Welcome To ResourceOne</h1> */}
      
    </div>
  );
}

export default App;
