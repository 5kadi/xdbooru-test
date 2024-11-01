import ImageCard from "./ImageCard"
import CommentCard from "./CommentCard"
import { useNavigate } from "react-router-dom"
import { useState } from "react"




function ActivityInfoSlider({username, data, type}) {
    const typeConfiguration = {
        'images': {
            Card: ImageCard,
            label: 'Recent Images',
            classNames: {
                grid: 'gap-2 grid grid-cols-5'
            }
        },
        'comments': {
            Card: CommentCard, 
            label: 'Recent Comments',
            classNames: {
                grid: 'flex flex-col gap-4'
            }
        }
    }

    const {Card, label, classNames} = typeConfiguration[type]

    //FUCK THOSE SHITTY ASS CSS TRANSITIONS
    //TWO HOURS THAT FELT LIKE ETERNITY AND NO RESULT AT ALL
    //THIS BULLSHIT IS HARDER THAN WHOLE FUCKING BACKEND IMPLEMENTATION

    return (
        <> 
            <div 
                className={
                    `flex flex-col items-start mx-12 p-2 md:p-4 mb-4 md:mb-8 rounded shadow`
                }
            >  
                <div className="w-full mb-2 md:mb-4">
                    <text
                        className="text-xl md:text-3xl text-gray-400 text-center" 
                    >
                        {label}
                    </text>
                </div>

                <div className={
                        `${classNames.grid} w-full`
                    }
                >  
                    {
                        data.map(
                            value => (
                                <a 
                                    href={`/images/${type === 'images' ? value.id : value.image}`}
                                >
                                    <Card data={value}></Card>
                                </a>
                            )
                        )
                    }
                </div>
            </div>

        </>
    )
}

export default ActivityInfoSlider