import {withProtection} from './Protection'
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { jwtDecode } from 'jwt-decode'
import api from "../api"
import { useState } from "react"
import { Navigate } from "react-router-dom"


function ProtectedRoute({ isAuthorized, children }) {
    return isAuthorized ? children : <Navigate to='/login'/> 
}

ProtectedRoute = withProtection(ProtectedRoute)

export default ProtectedRoute

