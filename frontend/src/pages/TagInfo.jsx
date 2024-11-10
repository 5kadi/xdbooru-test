import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";
import api from "../api";
import { useLocation, useParams } from "react-router-dom";
import { TagSearchBar } from "../components/SearchBars";
import { COLORS, TAGS_TYPES } from "../constants";



function TagInfo(props) {
    var search = useLocation().search?.substring(5) //Im too lazy to parse this string lmao
    const [data, setData] = useState(null)
    

    useEffect(() => {
        if (search) {
            console.log(search)
            getTagInfo()
        }
    }, [])

    const getTagInfo = () => {
        api.get(`api/tags/get/${search}`)
        .then(
            response => {
                if (response.status === 200) {
                    setData(response.data)
                    return
                }
                console.log('error')
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
            <NavMenu/>
            {
                data ? 
                    <div className="flex flex-col mx-auto w-11/12 mb-12">
                            <TagSearchBar/>
                        <div 
                            className="rounded shadow mx-auto h-fit min-h-[50vh] w-3/4 p-1 md:p-2
                            flex flex-col justify-between"
                        > 
                            <div className="flex flex-col">
                                <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center h-fit break-all">
                                    <span className={COLORS[data.type]}>
                                        {data.tag}
                                    </span> info
                                </h1>
                                <div className="flex flex-col text-xl md:text-2xl text-gray-400 pl-16 md:pl-32">
                                    <p>
                                        &gt; Type: <span className={COLORS[data.type]}>{TAGS_TYPES[data.type]}</span>
                                    </p>
                                    <p>
                                        &gt; Amount: <span className="text-black">{data.amount}</span>
                                    </p>
                                    <div className="min-h-10 h-fit">
                                        <p>&gt; Description:</p>
                                        <text className="text-black text-lg ml-4 md:ml-6 break-words ">
                                            {data.description}
                                        </text>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center my-2">
                                <a 
                                    href={data.type !== 'NE' && `/images/?tags=${data.tag}`}
                                    className={
                                        `${data.type !== 'NE' ? 'a-action-link-positive' : 'a-action-link-negative'}
                                        py-2 px-8 w-3/4`
                                    }
                                >
                                    View related Images
                                </a>
                            </div>

                        </div>
                    </div>
                : 
                    <div className="w-4/5 mx-auto">
                        <h1 
                            className="text-center text-2xl md:text-3xl text-cyan-300 font-bold mb-4 md:mb-8"
                        >
                            You can search about some tag info here!
                        </h1>
                        <TagSearchBar/>
                    </div>
                    
                
            }      
        </>
    )
}

export default TagInfo