import { useState } from "react"
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from "../constants"
import { useNavigate } from "react-router-dom"
import NavMenu from "../components/NavMenu"


function Auth({method}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const name = method === 'login' ? 'Login' : 'Register'
    const url = method === 'login' ? 'api/token/get/' : 'api/user/create/'
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        api.post(
            url,
            {
                username: username,
                password: password
            }
        )
        .then(
            response => {
                if (response.status === 200 || response.status === 201) {
                    setError(null)
                    if (method === 'register') {
                        navigate('/login')
                        return
                    }
                    localStorage.setItem(ACCESS_TOKEN, response.data.access)
                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                    localStorage.setItem(USER_DATA, JSON.stringify(response.data.userData))
                    navigate('/user/profile') //TODO: set user
                    return
                }
                setError(response)

            } //TODO: instant login after register
        )
        .catch(
            error => {
                setError(error)
                console.log(error)
            }
        )
    }

    return (
        <>  
            <NavMenu></NavMenu>
            <div className="flex justify-center font-sans mt-12 md:mt-24">
                <div className="rounded shadow h-fit w-3/5 md:w-1/2 p-4 md:p-8"> 
                    <h1 
                        className="text-center text-2xl md:text-3xl text-cyan-300 font-bold mb-2 md:mb-4"
                    >
                        {name}
                    </h1>  
                    <form 
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center mx-4 md:mx-16"
                    >
                        <input 
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Your username'
                            className="rounded shadow w-full p-1 md:p-2 mb-4"
                        />
                        <input 
                            type='text'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder='Your password'
                            className="rounded shadow w-full p-1 md:p-2 mb-4"
                        />
                        <button 
                            type='submit'
                            className={
                                `${error || !(username.length && password.length)  ? 'a-action-link-negative' : 'a-action-link-positive'} 
                                px-12 py-2`
                            }
                        >
                            &gt;&gt;
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Auth