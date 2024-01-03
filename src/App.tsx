import React, { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    const user =  {
      firstName: 'ADMIN_2',
      lastName: 'ADMIN_2',
      email: 'admin2@email.com',
      mobile: '1231231230',
      password: 'admin1@123',
      dob: new Date("2000-05-11"),
      userId: 'admin2',
      empId: '003',
      joinedDate: new Date("2022-07-07"),
      isAdmin: true,
      isActive: false,
      lastActive: new Date(),
      designation: 'Manager',
      address: "Mumbai, M.H",
      profileImageUrl: 'https://www.shutterstock.com/image-vector/admin-icon-strategy-collection-thin-600nw-2307398667.jpg'
  }  
    // fetch('http://localhost:1234/users/createUser', {
    //   method: 'post',
    //   body: JSON.stringify(user),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // } )
    // .then(res => res.json())
    // .then(data => console.log('DATA::', data))
    fetch('http://localhost:1234/users')
    .then(res => res.json())
    .then(data => console.log('DATA::', data))
  })
  return (
    <div className="App">
      <h1>Welcome To ResourceOne</h1>
    </div>
  );
}

export default App;
