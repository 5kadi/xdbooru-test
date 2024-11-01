
import { Navigate } from "react-router-dom"


function Logout() {
    localStorage.clear()

    return (
        <Navigate to='/login'></Navigate>
    )
}

export default Logout