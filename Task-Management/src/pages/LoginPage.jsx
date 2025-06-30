import React from 'react'
import Login from '../components/Auth/Login'

const LoginPage = ({setIsAuthenticated}) => {
  return <Login setIsAuthenticated={setIsAuthenticated}/>
}

export default LoginPage