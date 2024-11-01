import { useEffect, useRef, useState } from "react"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import api from "../api"
import CommentCard from "../components/CommentCard"
import '../styles/Images.css'



function CommentsList() {
    const {username} = useParams()
    const [currentPageURL, setCurrentPageURL] = useState(`api/comments/get/user/${username}`)
    const [nextPageURL, setNextPageURL] = useState()
    const [prevPageURL, setPrevPageURL] = useState()
    const [comments, setComments] = useState()

    useEffect(
        () => {
            fetchComments()

        }, [currentPageURL]
    )
    
    const fetchComments = () => {
        api.get(currentPageURL) //currentPageURL
        .then(
            response => {
                if (response.status === 200) {
                    setComments(response.data.results)
                    setNextPageURL(response.data.next ? response.data.next: currentPageURL)
                    setPrevPageURL(response.data.previous ? response.data.previous: currentPageURL)

                    return
                }
                alert('error') //TODO: error handling
            }
        )
        .catch(
            error => {
                alert(error) //TODO: error handling Xd
            }
        )
    }   

    return (
        <>  
            <div className="image-container">
                <h1>Comments</h1>
                <div className='image-grid'>
                    {
                        comments?.map(
                            comment => (
                                <a href={`/images/${comment.image}/`}><CommentCard data={comment}></CommentCard></a>
                            )
                        ) 
                    }
                </div>
                <button className='navigate' onClick={() => {setCurrentPageURL(prevPageURL)}}>Previous</button>
                <button className='navigate' onClick={() => {setCurrentPageURL(nextPageURL)}}>Next</button>
            </div>
        </>
    )
}

export default CommentsList