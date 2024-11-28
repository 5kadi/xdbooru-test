import {withProtection} from './Protection'
import { Navigate } from "react-router-dom"


function ProtectedRoute({ isAuthorized, children }) {
    return isAuthorized ? children : <Navigate to='/login'/> 
}

ProtectedRoute = withProtection(ProtectedRoute)

export default ProtectedRoute

