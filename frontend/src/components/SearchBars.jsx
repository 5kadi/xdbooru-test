import { useEffect, useRef, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import ErrorWindow from "./ErrorWindow"
import { COLORS } from "../constants"

//TODO: remove bloat hooks
const BaseSearchBar = (WrappedComponent) => {
    return (props) => {
        const [error, setError] = useState(null)

        const [inputTags, setInputTags] = useState('')
        const [autoTags, setAutoTags] = useState([])
        const tags = useRef()
    
        useEffect(
            () => {
                tags.current = inputTags.trim().split(/\s+/)
                matchingTags()
                //console.log(tags.current, inputTags, autoTags)
            }, [inputTags]
        )
    
        const autoComplete = (tag) => {
            tags.current[tags.current.length - 1] = tag
            setInputTags(tags.current.join(' '))
        }
    
        const matchingTags = () => {
            const tag = tags.current.at(-1)
            if (!tag.length) {
                setAutoTags([])
                return
            }
            api.get(`api/tags/get/auto/?search=${tag}`)
            .then(
                response => {
                    if (response.status === 200) {
                        setAutoTags(response.data)
                        return
                    } 
                    alert('error')
                }
            )
            .catch(
                error => {
                    setError(error)
                }
            )
    
        }

        return error ? 
                    <ErrorWindow error={error} setError={setError}/>
                :
                    <WrappedComponent 
                        setInputTags={setInputTags} 
                        inputTags={inputTags} 
                        autoComplete={autoComplete} 
                        autoTags={autoTags} 
                        tags={tags}
                        {...props}
                    />
    }
}

function SearchBar({setInputTags, inputTags, autoComplete, autoTags, tags}){
    const navigate = useNavigate()

    const handleSubmit = (e) => { //NOTE: patchConfig bullshit has been removed
        e.preventDefault()
        const formattedTags = tags.current.join('+')
        navigate(`/images/?tags=${formattedTags}`)
        window.location.reload() //doesnt work without this thing smh
    }

    return (
        <>
            <div className="mx-auto container relative mb-8 md:mb-16">
                <form onSubmit={handleSubmit} className="mx-8 md:mx-16 flex flex-row">
                    <input 
                        type='text'
                        value={inputTags}
                        onChange={e => setInputTags(e.target.value)}
                        placeholder='Input some tags to search'
                        className="rounded shadow w-full p-1 md:p-2 mr-2 shadow-transition focus:shadow-lg"
                    />
                    <button 
                        type='submit' 
                        className="a-action-link-positive shadow-md py-1 md:py-2 px-3 md:px-6 "
                    >
                        Search
                    </button>
                </form>
                <div className="relative mx-8 md:mx-16">
                    {
                        <div
                            className={
                                `${autoTags.length >= 1 ? 'scale-y-100' : 'scale-y-0'} 
                                h-fit rounded shadow-md p-2 md:p-4 transition duration-100 popdown-menu bg-white`
                            }
                        >
                            {   
                                autoTags.length >= 1 && autoTags.map(
                                    tag => (
                                        <p 
                                            onClick={e => autoComplete(tag.tag)}
                                            className={`ml-1 md:ml-4 selectable-text ${COLORS[tag.type]} break-all`}
                                        >
                                            {tag.tag} {tag.amount}
                                        </p>
                                    )
                                )
                            }
                        </div>  
                    }

                </div>
            </div>
        </>
    )
}
SearchBar = BaseSearchBar(SearchBar)

function AddTagSearchBar({setTags, setInputTags, inputTags, autoTags, tags}) {

    const handleAdd = (tag) => {
        if (inputTags.length) {
            setTags(t => [...t, tag])
            setInputTags('')
            tags.current = []
        }

    }

    return (
        <>
            <div className="container relative w-full mb-4 md:mb-8">
                <div className="flex flex-row">   
                    <input 
                        type='text'
                        value={inputTags}
                        onChange={e => setInputTags(e.target.value)}
                        placeholder='Input some tags to search'
                        className="rounded shadow w-full p-2 mr-2 shadow-transition focus:shadow-lg"
                    />
                    <button 
                        className={
                            `${inputTags.length ? 'a-action-link-positive' : 'a-action-link-negative'} 
                            shadow-md py-1 md:py-2 px-3 md:px-6`
                        }
                        onClick={e => handleAdd(inputTags)}
                        type="button"
                    >
                        Add
                    </button>
                </div>

                <div className="relative">
                    {
                        <div
                            className={
                                `${autoTags.length >= 1 && inputTags.length ? '' : 'scale-y-0'} 
                                h-fit rounded shadow-md p-2 md:p-4 transition duration-100 popdown-menu bg-white`
                            }
                        >
                            {   
                                autoTags.length >= 1 && autoTags.map(
                                    tag => (
                                        <p 
                                            onClick={e => handleAdd(tag.tag)}
                                            className={`ml-1 md:ml-4 selectable-text ${COLORS[tag.type]} break-all`}
                                        >
                                            {tag.tag} {tag.amount}
                                        </p>
                                    )
                                )
                            }
                        </div>  
                    }
                </div>
            </div>
        </>
    )
}

AddTagSearchBar = BaseSearchBar(AddTagSearchBar)

function TagSearchBar({setInputTags, inputTags, autoTags}) {

    const navigate = useNavigate()

    const handleAdd = (tag) => {
        navigate(`/tags/?tag=${tag}`)
        window.location.reload()

    }

    return (
        <>
            <div className="container relative w-full mb-4 md:mb-8">
                <div className="flex flex-row">   
                    <input 
                        type='text'
                        value={inputTags}
                        onChange={e => setInputTags(e.target.value)}
                        placeholder='Input some tags to search'
                        className="rounded shadow w-full p-2 mr-2 shadow-transition focus:shadow-lg"
                    />
                    <button 
                        className={
                            `${inputTags.length ? 'a-action-link-positive' : 'a-action-link-negative'} 
                            shadow-md py-1 md:py-2 px-3 md:px-6`
                        }
                        onClick={e => handleAdd(inputTags)}
                        type="button"
                    >
                        Search
                    </button>
                </div>

                <div className="relative">
                    {
                        <div
                            className={
                                `${autoTags.length >= 1 && inputTags.length ? '' : 'scale-y-0'} 
                                h-fit rounded shadow-md p-2 md:p-4 transition duration-100 popdown-menu bg-white`
                            }
                        >
                            {   
                                autoTags.length >= 1 && autoTags.map(
                                    tag => (
                                        <p 
                                            onClick={e => handleAdd(tag.tag)}
                                            className={`ml-1 md:ml-4 selectable-text ${COLORS[tag.type]} break-all`}
                                        >
                                            {tag.tag} {tag.amount}
                                        </p>
                                    )
                                )
                            }
                        </div>  
                    }
                </div>
            </div>
        </>
    )
}
TagSearchBar = BaseSearchBar(TagSearchBar)


export {
    SearchBar, 
    AddTagSearchBar,
    TagSearchBar
}