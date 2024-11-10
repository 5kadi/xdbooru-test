
import { useEffect, useState } from "react"
import { COLORS } from "../constants"
import api from "../api"
import ErrorWindow from "./ErrorWindow"

//This shit barely works lmfao
const BaseTagList = ({tagsData, setTagsData, customHandleDelete}) => {
    const handleDelete = (itemIdx) => {
        setTagsData(
            tagsData.filter(
                (tag, idx) => {
                    return idx !== itemIdx
                }
            )   
        )
        customHandleDelete && customHandleDelete(itemIdx)
    }

    return (
        <>  
            {
                tagsData.length >= 1 && <div className="h-fit shadow rounded p-2 md:p-4 text-lg md:text-md">
                    {
                        tagsData.map(
                            (tag, idx) => ( 
                                <div className="grid grid-cols-7 mb-4 md:mb-0">
                                    <a 
                                        className={`col-span-5 break-all ${COLORS[tag.type]}`} //TODO: colors
                                    >
                                        {tag.tag}
                                    </a>
                                    <span className="col-span-1 text-center">
                                        {tag.amount}
                                    </span>
                                    <span className="col-span-1 flex items-center justify-center">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth={1.5} 
                                            stroke="currentColor" 
                                            onClick={e => handleDelete(idx)}
                                            className="w-1/2 md:w-1/3 h-auto stroke-red-400 hover:stroke-red-500 cursor-pointer"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </div>
                            )
                        )
                    }
                </div>
            }
        </>
    )
}

function LazyTagList({tags, setTags}) {
    const [error, setError] = useState(null)

    const [tagsData, setTagsData] = useState([])

    useEffect(() => {
        if (tags.length !== tagsData.length) {
            fetchTag()
        }
    }, [tags])

    const fetchTag = () => {
        api.get(`api/tags/get/auto/?search=${tags.at(-1)}`)
        .then(
            response => {
                if (response.status === 200) {
                    if (response.data.length >= 1) {
                        var resultingTag = response.data[0] //?
                    }   
                    else {
                        var resultingTag = {
                            tag: tags.at(-1),
                            amount: 'N/A',
                            type: 'NE'
                        }
                    }

                    setTagsData([...tagsData, resultingTag])
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

    const customHandleDelete = (itemIdx) => {
        setTags(
            tags.filter(
                (tag, idx) => {
                    return idx !== itemIdx
                }
            )
        )
    }

    return (
        <>
            <ErrorWindow error={error} setError={setError}/>
            <BaseTagList tagsData={tagsData} setTagsData={setTagsData} customHandleDelete={customHandleDelete}/>
        </>
    )
    
}

function TagList({tagsData, setTagsData}) {
    //This function has literally no purpose lmao
    return (
        <>  
            <BaseTagList tagsData={tagsData} setTagsData={setTagsData}/>
        </>
    )
}

export {
    LazyTagList,
    TagList,
}