import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "../api"
import ImageCard from "../components/ImageCard"
import { ViewTags } from "../components/Tags"
import NavMenu from "../components/NavMenu"
import {SearchBar} from "../components/SearchBars"
import ErrorWindow from "../components/ErrorWindow"
import Loading from "../components/Loading"


function Images() {
    const [error, setError] = useState(null)
    const search = useLocation().search
    
    const [currentPageURL, setCurrentPageURL] = useState(`api/images/get/${search}`)
    const [nextPageURL, setNextPageURL] = useState(null)
    const [prevPageURL, setPrevPageURL] = useState(null)
    const [data, setData] = useState()

    useEffect(
        () => {
            fetchImages()
        }, [currentPageURL]
    )
    
    const fetchImages = () => {
        api.get(currentPageURL) //currentPageURL
        .then(
            response => {
                if (response.status === 200) {
                    setData(response.data)

                    const {next, previous} = response.data
                    setNextPageURL(u => next?.substr(next.lastIndexOf('/') + 1))
                    setPrevPageURL(u => previous ? previous.substr(previous.lastIndexOf('/') + 1) || '?page=1' : null)
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

    return (
        <>  
            {
                (!data && !error) && <Loading/>
            }
            <ErrorWindow error={error} setError={setError}/>
            <NavMenu></NavMenu>
            <SearchBar></SearchBar>
            <div className="grid grid-cols-12 h-screen w-11/12">
                <div className="col-span-3">
                {
                    data && <ViewTags imageTags={data.tags}/>
                }
                </div>
                <div className="col-span-9 mx-4 w-full mb-12 md:mb-24">   
                    <div className='grid grid-cols-3 md:grid-cols-6 gap-3 mb-8 md:mb-16'>
                        {
                            data?.images.map(
                                image => (
                                    <ImageCard data={image}></ImageCard>
                                )
                            ) 
                        }
                    </div>
                    <div className="flex justify-center gap-8 text-md md:text-lg">
                        <a 
                            className={
                                `${prevPageURL ? 'a-action-link-positive' : 'a-action-link-negative'} py-2 px-8 w-36`
                            }
                            href={prevPageURL}
                        >
                            Previous
                        </a>
                        <a 
                            className={
                                `${nextPageURL ? 'a-action-link-positive' : 'a-action-link-negative'} py-2 px-8 w-36`
                            }
                            href={nextPageURL}
                        >
                            Next
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Images