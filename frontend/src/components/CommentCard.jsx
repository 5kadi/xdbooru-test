import { useRef } from "react"
import api from "../api"

function CommentCard({data}) {
    return (
        <div 
            className="w-full h-fit min-h-40 rounded p-1 md:p-3 mb-2 overflow-clip text-clip shadow-transition"
        >   
            <div className="h-full">
                <h1 
                    className="text-lg md:text-2xl mb-1 md:mb-2"
                >
                    {data.user.username}
                </h1>
                <p 
                    className="text-sm md:text-lg mb-2 md:mb-4 ml-4 break-words"
                >
                    {data.comment}
                </p>
                <p 
                    className="text-end text-gray-400 text-xs md:text-md"
                >
                    {data.date}
                </p>
                {/*<p>{data.score}</p> Likes are currently too hard to implement xd*/}
            </div>

        </div>
    )
}

export default CommentCard