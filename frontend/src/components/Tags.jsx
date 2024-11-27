import { useEffect, useState } from "react"
import api from "../api"
import { COLORS } from "../constants"
import Loading from "./Loading"



const Tags = (WrappedComponent) => {
    return ({imageId, imageTags}) => {
        const [tags, setTags] = useState(imageTags)
    
        useEffect(
            () => {
                if (!imageTags) {
                    fetchTags()
                }
            }, [imageId]
        )
    
        const fetchTags = () => {
            api.get(`api/images/get/${imageId}/`)
            .then(
                response => {
                    if (response.status === 200) {
                        setTags(response.data.tags)
                        return
                    }
                    alert('error')
                }
            )
            .catch(
                error => {
                    alert(error)
                }
            )
        }
        return tags ? <WrappedComponent tags={tags} imageId={imageId}/> : <Loading/>
    }

}

function ViewTags({imageTags}){

    return (
        <>
            <div className="flex flex-col px-2 md:px-6 rounded shadow h-full">
                <h3 className="text-center text-3xl font-bold mb-2 md:mb-4 text-gray-400">Tags</h3>
                <div className="h-fit text-lg md:text-md"> 
                    {  
                        imageTags.map(
                            tag => ( 
                                <div className="grid grid-cols-12 mb-4 md:mb-0">
                                    <a 
                                        href={`/tags/?tag=${tag.tag}`}
                                        className="col-span-1 text-center text-gray-400 hover:text-gray-500 my-auto"
                                    >
                                        ?
                                    </a>
                                    <a 
                                        href={`/images/?tags=${tag.tag}`}
                                        className="col-span-11 break-all selectable-text grid grid-cols-6"
                                    >   
                                        <span className={`col-span-5 ${COLORS[tag.type]}`}>{tag.tag}</span>
                                        <span className="col-span-1 text-center">{tag.amount}</span>
                                    </a>

                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

function EditTags({imageId, imageTags}) {
    const deleteTag = (tagName) => {
        api.patch(
            `api/images/update/${imageId}`,
            {
                tags: [tagName],
                remove: true
            }
        )
        .then(
            response => {
                console.log(response.status, response.data)
            }
        )
        .catch(
            error => {
                alert(error)
            }
        )
    }

    return (
        <>
            <div className="flex flex-col px-2 md:px-6 rounded shadow h-full">
                <h3 className="text-center text-3xl font-bold mb-2 md:mb-4 text-gray-400">Tags</h3>
                <div className="h-fit text-lg md:text-md"> 
                    {  
                        imageTags?.map(
                            tag => ( 
                                <div className="grid grid-cols-12 mb-4 md:mb-0">
                                    <a 
                                        href={`/tags/?tag=${tag.tag}`}
                                        className="col-span-1 text-center text-gray-400 hover:text-gray-500 my-auto"
                                    >
                                        ?
                                    </a>
                                    <a 
                                        href={`/images/?tags=${tag.tag}`}
                                        className="col-span-11 break-all selectable-text grid grid-cols-6"
                                    >   
                                        <span className={`col-span-5 ${COLORS[tag.type]}`}>{tag.tag}</span>
                                        <span className="col-span-1 text-center">{tag.amount}</span>
                                    </a>

                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}
EditTags = Tags(EditTags)

export {
    ViewTags,
    EditTags
}