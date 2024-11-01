import { useEffect, useRef, useState } from "react";
import api from "../api";
import CommentCard from "./CommentCard";
import { useLocation } from "react-router-dom";
import ResizingTextarea from "./ResizingTextarea";


function Comments({imageId}){
    const [comments, setComments] = useState()
    const [comment, setComment] = useState('')

    useEffect(
        () => {
            fetchComments()
        }, [comment]
    )


    const fetchComments = () => {
        api.get(`api/comments/get/image/${imageId}`)
        .then(
            response => {
                if (response.status === 200) {
                    setComments(response.data.results)
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
                        console.log(4)
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

    }
 
    return (
        <>  
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
                                `${comment.length ? 'a-action-link-positive' : 'a-action-link-negative'} py-1 md:py-2 px-2 md:px-4  w-1/3`
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