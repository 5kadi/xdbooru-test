import { useEffect, useState } from "react"
import api from "../api"
import { useParams } from "react-router-dom"
import ActivityInfoSlider from "../components/ActivityInfoSlider"
import NavMenu from "../components/NavMenu"
import ErrorWindow from "../components/ErrorWindow"
import Loading from "../components/Loading"



function Profile({isLogged}) {
    const [error, setError] = useState(null)
    const {username} = useParams()

    const url = isLogged ? 'api/user/profile/' : `api/profile/${username}/`
    const [profileData, setProfileData] = useState()

    useEffect(
        () => {
            fetchProfileData()
        }, []
    )

    const fetchProfileData = () => {
        api.get(url)
        .then(
            response => {
                if (response.status === 200) {
                    setProfileData(response.data)
                    return
                }
                alert('error')
            }
        )
        .catch(
            error => {
                setError(error)
            }
        )
    }

    return (
        <>  
            {
                (!profileData && !error) && <Loading/>
            }
            <ErrorWindow error={error} setError={setError}/>
            <NavMenu></NavMenu>
            <div>
                {
                    profileData && 
                        <div className="flex flex-col">
                            <div className="rounded shadow mb-4 md:mb-8 mx-12 p-4 md:p-8 text-center">
                                {
                                    !isLogged ?
                                        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 h-fit break-all">
                                            <span className="text-3xl md:text-5xl text-cyan-300">
                                                {profileData.user.username}
                                            </span>'s profile
                                        </h1>
                                    : 
                                        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 h-fit break-all">
                                            {profileData.user.username}
                                        </h1>
                                }
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <span className="text-xl md:text-2xl mr-4 mb:mr-8 text-gray-400">
                                            Total Images: <span>{profileData.total}</span>
                                        </span>
                                        <a 
                                            href={`/images/?user=${profileData.user.username}`}
                                            className="a-action-link-positive py-1 md:py-2 px-2 md:px-4"
                                        >
                                            View All
                                        </a>
                                    </div>
                                    {
                                        isLogged && 
                                            <div className="mt-4">
                                                <a
                                                    href="/logout"
                                                    className="a-action-link-negative py-1 md:py-2 px-8 md:px-16 "
                                                >
                                                    Log Out
                                                </a>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    ['images', 'comments'].map(
                                        type => (
                                            <div>
                                                <ActivityInfoSlider 
                                                    username={profileData.user.username} 
                                                    data={profileData[type]} 
                                                    type={type}
                                                />
                                            </div>
                                        )
                                    )
                                }                                
                            </div>

                        </div>
                }
            </div>
        </>

    )
}


export default Profile