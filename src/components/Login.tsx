import React, { ChangeEvent, useState } from 'react'
import {useParams} from 'react-router-dom'  
import { useFormik } from 'formik';
import * as YUP from 'yup';  

function Login() {
    const [data,setData] = useState({
        userId:'',
        password:'',
        isAdmin:false
    })
    const [error,setError] = useState('')
    const { name } = useParams()
    console.log(name)
    const formik = useFormik({
        initialValues :{
            userId:'',
            password:'',
            isAdmin:false
        },
        validationSchema:YUP.object({}),
        onSubmit:(values)=>{
            setData({...data,...values})
        }
    })
    const handleSubmit =async (event:React.MouseEvent<HTMLInputElement, MouseEvent>)=>{
        event.preventDefault()
        console.log(data,"DATA")
        const apijsondata = await fetch('http://192.168.10.30:1234/users/login',{
            method:'POST',
            headers:{
                "Content-Type": 'application/json'
            },
            body:JSON.stringify(formik.values)
        })
        const apidata = await apijsondata.json()
        console.log(apidata,"ApiCall::")
        if(apidata.error){
            setError(apidata.error)
            setTimeout(()=>{
                setError('')
            },2000)
        }
        setData({...data,userId:'',password:'',isAdmin:false})
    }
  return (
    <div className='login'>
        <h1>{name} Login Page</h1>
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className='form'> 
            <label htmlFor="userId">USERID: </label>
                <input
                  type="text"
                  id="userId"
                  {...formik.getFieldProps('userId')}
                />
            <label htmlFor="password">PASSWORD: </label>
                <input
                  type="password"
                  id="password"
                  {...formik.getFieldProps('password')}
                />
                <input type='submit' value={`${name} Login`} onClick={(e)=>handleSubmit(e)}/>
                <p>{error}</p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login