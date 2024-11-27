import { useState } from "react"
import api from "../api"
import { TAGS_TYPES, COLORS } from "../constants"
import NavMenu from "../components/NavMenu"
import ResizingTextarea from "../components/ResizingTextarea"
import { useNavigate } from "react-router-dom"
import ErrorWindow from "../components/ErrorWindow"


function CreateTags(){
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [tag, setTag] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [hover, setHover] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault()
        if (tag.length && type.length && description.length) { 
            const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, '_')
            api.post(
                'api/tags/create/',
                {
                    tag: formattedTag,
                    type: type,
                    description: description
                }
            )
            .then(
                response => {
                    if (response.status === 201) {
                        navigate(`/tags/?tag=${formattedTag}`)
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
            <NavMenu></NavMenu>
            <div className="flex justify-center mt-12 md:mt-24">
                <div className="w-2/3">
                    <div className="rounded shadow p-2 md:p-4">
                        <h1
                            className="text-xl md:text-2xl text-cyan-300 font-bold mb-2 md:mb-4 text-center"  
                        >
                            You can create some tags here!
                        </h1>
                        <form 
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <input
                                type='text'
                                value={tag}
                                onChange={e => setTag(e.target.value)}
                                placeholder='Select a tag name'
                                className="shadow-transition p-1 md:p-2"
                            />
                            <div 
                                className="w-full flex flex-col"
                                onClick={e => setHover(h => !h)}
                            >   
                                <div className="shadow-transition w-full a-nav-link select-none">
                                    <p className="grid grid-cols-4"> 
                                        <text className="col-span-3">
                                            Selected a tag type:&#9;
                                            <span 
                                                className={`${COLORS[type]}`}
                                            >
                                                {TAGS_TYPES[type]}
                                            </span>
                                        </text>
                                        <div className="col-span-1 text-end">
                                            {
                                                hover ? 
                                                    <span>&#129171;</span> 
                                                : 
                                                    <span className>&#129170;</span>
                                            } 
                                        </div>
  
                                    </p>
                                </div>
                                <div className="relative h-auto w-full">
                                    <div 
                                        className={
                                            `${!hover && 'scale-y-0'} transition duration-100 origin-top absolute
                                            bg-white rounded shadow-md h-fit w-full`
                                        }
                                    >
                                        {
                                            Object.keys(TAGS_TYPES).map(key => (
                                                <p
                                                    className={`${COLORS[key]} selectable-text p-1 md:p-2`}
                                                    onClick={e => setType(key)}
                                                >
                                                    {TAGS_TYPES[key]}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <ResizingTextarea
                                textState={description} 
                                setText={setDescription} 
                                placeholder={'Introduce a description to your tag'}
                            />
                            <button 
                                type='submit'
                                className={
                                    `${
                                        !(tag.length && type.length && description.length) 
                                            ? 'a-action-link-negative' 
                                            : 'a-action-link-positive'
                                    } px-12 py-1`
                                }
                            >
                                Create Tag!
                            </button>
                        </form> 
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateTags