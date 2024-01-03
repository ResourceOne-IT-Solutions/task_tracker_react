import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Home = () => {
    const navigate = useNavigate()
const handleclick =  (name:string) =>{
    navigate('/login/'+name)
}

    return (
        <>
            <div className='homepage'>
                <div className='loginbuttons'>
                 
                <Button variant="dark" onClick={() => handleclick('Admin')}>Admin Login</Button>

                <Button variant="dark" onClick={() => handleclick('User')}>User Login</Button>
                
               
                </div>
                <p className='welcometext'>Welcome To,</p>
                <p className='welcometext'>Resource One It Solutions</p>
            </div>
        </>

    )
}

export default Home