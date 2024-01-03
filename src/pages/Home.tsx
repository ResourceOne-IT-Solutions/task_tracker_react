import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import  Button  from 'react-bootstrap/Button'
function Home() {
    const navigate = useNavigate()
    const handleClick=(name : string)=>{
        navigate('/login/'+name)
    }
  return (
    <div>
        <div className='btns'>
        <Button variant="primary" onClick={()=>handleClick("Admin")}>Admin Login</Button>{' '}
        <Button variant="primary" onClick={()=>handleClick("User")}>User Login</Button>
    </div>
    <div className='heading'>
        <h3>Welcome To,</h3>
        <h1>RESOURCE ONE IT SOLUTIONS</h1>
    </div>
    </div>
  )
}

export default Home