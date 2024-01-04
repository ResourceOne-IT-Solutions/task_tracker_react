import React from 'react'
import { useLocation } from 'react-router-dom'

const AdminDashboard = ()=> {
    const d= useLocation().state
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard