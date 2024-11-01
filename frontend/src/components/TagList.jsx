
import { useEffect, useState } from "react"
import { COLORS } from "../constants"
import api from "../api"



function TagList({tags}) {

    const [tagsData, setTagsData] = useState([])

    useEffect(() => {
        fetchTag()
    }, [tags])

    const fetchTag = (tag) => {
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
                alert('error')
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
            <div className="h-fit shadow rounded p-2 md:p-4 text-lg md:text-md">
                {
                    tagsData.length >= 1 && tagsData.map(
                        tag => ( 
                            <div className="grid grid-cols-6 mb-4 md:mb-0">
                                <a 
                                    className={`col-span-5 break-all ${COLORS[tag.type]}`} //TODO: colors
                                >
                                    {tag.tag}
                                </a>
                                <span className="col-span-1 text-center">
                                    {tag.amount}
                                </span>
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
}

export default TagList