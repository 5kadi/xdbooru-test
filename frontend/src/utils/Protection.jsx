
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { jwtDecode } from 'jwt-decode'
import api from "../api"
import { useState, useEffect } from "react"
import Loading from "../components/Loading"

export const withProtection = (WrappedComponent) => {
    return (props) => {

        const [isAuthorized, setIsAuthorized] = useState(null)

        useEffect(
            () => {
                auth()
                .catch(
                    (error) => {
                        setIsAuthorized(false)
                    }
                )
            }, []
        )
        
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN)
            if (!token) {
                setIsAuthorized(false);
                return
            }
            const decoded = jwtDecode(token)
            const tokenExpiration = decoded.exp
            const now = Date.now() / 1000
    
            if (tokenExpiration < now) {
                await refreshToken()
            } else {
                setIsAuthorized(true)
            }
        }
    
        const refreshToken = async () => {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN)
            api.post(
                'api/token/refresh/', 
                {
                    refresh: refreshToken
                }
            )
            .then(
                response => {
                    if (response.status === 200) {
                        localStorage.setItem(ACCESS_TOKEN, response.data.access)
                        setIsAuthorized(true)
                    } else {
                        setIsAuthorized(false)
                    }
                }
            )
            .catch(
                error => {
                    setIsAuthorized(false)
                }
            )
        }
    
        return isAuthorized !== null ? 
                <WrappedComponent isAuthorized={isAuthorized} {...props}/> 
            : 
                <Loading/>
    }
}