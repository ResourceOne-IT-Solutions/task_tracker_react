import React from 'react'
import { useLocation } from 'react-router-dom'

const AdminDashboard = ()=> {
    const d= useLocation().state
    console.log(d,"6666")
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard