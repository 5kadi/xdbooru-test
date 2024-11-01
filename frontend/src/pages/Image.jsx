import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, useParams } from "react-router-dom"
import Comments from "../components/Comments"
import { ViewTags, EditTags } from "../components/Tags"
import NavMenu from "../components/NavMenu"
import {SearchBar} from "../components/SearchBars"


function Image(WrappedComponent) {
    return (props) => {
        const [imageData, setImageData] = useState()
        const {pk} = useParams()
    
        useEffect(
            () => {
               getImageData() 
            }, []
        )
    
        const getImageData = () => {
            api.get(`api/images/get/${pk}/`)
            .then(
                response => {
                    if (response.status === 200) {
                        setImageData(response.data)
                        return
                    }
                    alert('error') //you know
                }
            )
            .catch(
                error => {
                    alert(error) //same
                }
            )
        }

        return imageData ? <WrappedComponent imageData={imageData}/> : <>Loading...</>
    }
}

 
function ViewImage({imageData}){
    const {id, tags, user, image, description, date} = imageData
    const navigate = useNavigate()

    const redirect = (url) => { //mv to utils
        navigate(url)
        window.location.reload()
    }

    return (
        <>   
            <NavMenu></NavMenu>
            <SearchBar></SearchBar>
            <div className="container grid grid-cols-8 h-screen">
                <div className="col-span-2">
                    <ViewTags imageId={id} imageTags={tags}/>
                </div>
                <div className="col-span-6 flex flex-col mx-2 md:mx-4">
                    <div className="w-full rounded shadow-md mb-4 md:mb-8"> 
                        <div 
                            className="p-1 md:p-2 flex items-center justify-center 
                            mb-4 md:mb-8"
                        >
                            <img 
                                src={`${import.meta.env.VITE_API_URL}${image}`}
                                className="w-7/12 h-auto object-contain"
                            ></img>
                        </div>     
                        <div className="w-full h-fit p-1 md:p-2 pb-4 md:pb-12 grid grid-cols-8">
                            <div className="col-span-7">
                                <p 
                                    onClick={e => redirect(`/profile/${user.username}`)}
                                    className="selectable-text text-center text-lg md:text-2xl font-bold"
                                >
                                    Author: <span className=" text-cyan-300">{user.username}</span>
                                </p>
                                <div class="bg-neutral-200 h-px my-2 md:my-4"></div>
                                <p
                                    className="text-md md:text-xl break-words ml-16"
                                >
                                    {description}
                                </p>
                            </div>
                            <div className="flex items-start justify-end">
                                <a 
                                    href={`/images/edit/${id}`}
                                    className="a-action-link-positive py-1 md:py-2 px-2 md:px-4 col-span-1 "
                                >
                                    Edit
                                </a> 
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-400 mb-4 md:mb-8">Comments</h1>
                        <Comments imageId={id}/>
                    </div>
                </div>   
            </div>
        </>
    )
} 
ViewImage = Image(ViewImage)

function EditImage({imageData}) {
    const {id, tags, user, image, description, date} = imageData

    return (
        <>   
            <div>
                <p>Edit Image</p>
                <img src={`${import.meta.env.VITE_API_URL}${image}`}></img>
                <div>
                    <p>{description}</p>
                </div>
                <EditTags imageId={id} imageTags={tags}/>
            </div>
        </>
    )
}
EditImage = Image(EditImage)


export {
    ViewImage,
    EditImage
}