import { useEffect, useState } from "react";
import api from "../api";
import CommentCard from "./CommentCard";
import ResizingTextarea from "./ResizingTextarea";
import ErrorWindow from "./ErrorWindow";


function Comments({imageId}){
    const [error, setError] = useState(null)

    const [comments, setComments] = useState()
    const [comment, setComment] = useState('')

    useEffect(
        () => {
            fetchComments()
        }, []
    )


    const fetchComments = () => {
        api.get(`api/comments/get/image/${imageId}`)
        .then(
            response => {
                if (response.status === 200) {
                    setComments(response.data.results)
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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (comment.length){
            api.post(
                'api/comments/create/',
                {
                    comment: comment,
                    image: imageId
                }
            )
            .then(
                response => {
                    if (response.status === 201) {
                        setComment('')
                        fetchComments()
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

    }
 
    return (
        <>  
            <ErrorWindow error={error} setError={setError}/>
            <div className="container ">
                <div className="w-full mb-8 md:mb-16">
                    <form 
                        onSubmit={handleSubmit}
                        className="flex flex-col items-end"
                    >
                        <ResizingTextarea 
                            textState={comment}
                            setText={setComment} 
                            placeholder={'Write a comment'}
                        />
                        <button 
                            type='submit'
                            className={
                                `${comment.length ? 'a-action-link-positive' : 'a-action-link-negative'} 
                                py-1 md:py-2 px-2 md:px-4 w-1/3`
                            }
                        >
                            Post!
                        </button>
                    </form>
                </div>

                <div>
                    {
                        comments?.map(
                            comment => (
                                <a  
                                    href={`/profile/${comment.user.username}`} 
                                >
                                    <CommentCard data={comment}></CommentCard>
                                </a>
                                
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Comments