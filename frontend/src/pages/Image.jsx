import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate, useParams } from "react-router-dom"
import Comments from "../components/Comments"
import { ViewTags, EditTags } from "../components/Tags"
import NavMenu from "../components/NavMenu"
import {AddTagSearchBar, SearchBar} from "../components/SearchBars"
import ErrorWindow from "../components/ErrorWindow"
import { USER_DATA } from "../constants"
import { TagList, LazyTagList } from "../components/TagList"
import ResizingTextarea from "../components/ResizingTextarea"
import Loading from "../components/Loading"


function Image(WrappedComponent) {
    return (props) => {
        const [error, setError] = useState(null)
        const {pk} = useParams()

        const [imageData, setImageData] = useState()
    
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
                }
            )
            .catch(
                error => {
                    setError(error)
                }
            )
        }

        return imageData && !error ? 
                    <WrappedComponent imageData={imageData}/> 
                : error ?
                    <ErrorWindow error={error} setError={setError}/>
                : 
                    <Loading/>
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
                        <div className="p-1 md:p-2 mb-4 md:mb-8">   
                            <a
                                href={image}
                                className="flex items-center justify-center"
                                target="_blank"
                            >
                                <img 
                                    src={image}
                                    className="w-7/12 h-auto object-contain"
                                />
                            </a>
                        </div>     
                        <div className="w-full h-fit p-1 md:p-2 pb-4 md:pb-12 grid grid-cols-8">
                            <div className="col-span-7">
                                <p 
                                    onClick={e => redirect(`/profile/${user.username}`)}
                                    className="selectable-text text-center text-lg md:text-2xl font-bold break-all h-fit"
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
                                {
                                    JSON.stringify(user) === localStorage.getItem(USER_DATA) &&
                                        <a 
                                        href={`/images/edit/${id}`}
                                        className="a-action-link-positive py-1 md:py-2 px-2 md:px-4 col-span-1 "
                                        >
                                            Edit
                                        </a> 
                                }
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
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [tags, setTags] = useState(imageData.tags)
    const [inputTags, setInputTags] = useState([])
    const [description, setDescription] = useState(imageData.description)
    

    const handleSubmit = () => {
        if (description.length && (tags.length || inputTags.length)) {
            const formattedTags = inputTags.concat(
                tags.map(
                    tag => tag.tag
                )
            )
            api.patch(
                `api/images/edit/${imageData.id}`,
                {
                    tags: formattedTags,
                    description: description
                }
            )
            .then(
                response => {
                    if (response.status === 200) {
                        navigate(`/images/${imageData.id}`)
                    }
                }
            )
            .catch(
                error => {
                    setError(error)
                }
            )
        }
    }

    return (
        <>   
            <ErrorWindow error={error} setError={setError}/>
            <NavMenu/>
            <div className="flex flex-col gap-8 mx-6 md:mx-12 mb-16">
                <h1 className="text-2xl md:text-3xl text-cyan-300 font-bold text-center">
                    Edit Image Description & Tags
                </h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-1">
                        <h1 className="text-center text-xl md:text-2xl text-gray-400 font-bold">Change Description</h1>
                        <ResizingTextarea textState={description} setText={setDescription}/>
                    </div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <div>
                            <h1 className="text-center text-xl md:text-2xl text-gray-400 font-bold">Add Tags</h1>
                            <AddTagSearchBar setTags={setInputTags}/>
                            <LazyTagList tags={inputTags} setTags={setInputTags}/>
                        </div>
                        <div>
                            <h1 className="text-center text-xl md:text-2xl text-gray-400 font-bold">Remove Tags</h1>
                            <TagList tagsData={tags} setTagsData={setTags}/>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    className={
                        `${!(description.length && (tags.length || inputTags.length)) ? 'a-action-link-negative' : 'a-action-link-positive'}
                        py-2 px-12 w-1/2 self-center fixed bottom-4`
                    }
                > 
                    Apply Changes!
                </button>
            </div>
        </>
    )
}
EditImage = Image(EditImage)


export {
    ViewImage,
    EditImage
}