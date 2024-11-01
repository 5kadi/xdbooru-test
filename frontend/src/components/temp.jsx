function SearchBar(){
    const [inputTags, setInputTags] = useState('')
    const [autoTags, setAutoTags] = useState()
    const tags = useRef()

    const navigate = useNavigate()

    useEffect(
        () => {
            tags.current = inputTags.toString().split(/\s+/)
            matchingTags()

        }, [inputTags]
    )

    const autoComplete = (tag) => {
        tags.current[tags.current.length - 1] = tag 
        setInputTags(tags.current.join(' '))
    }

    const matchingTags = () => {
        const tag = tags.current.at(-1)
        if (!tag.length) {
            return
        }
        api.get(`api/tags/get/?search=${tag}`)
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
                alert(error)
            }
        )

    }

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
                        placeholder='Input tags to search'
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
                                `${autoTags?.length >= 1 && inputTags.length ? '' : 'scale-y-0'} 
                                h-fit rounded shadow-md p-2 md:p-4 transition duration-100 popdown-menu bg-white`
                            }
                        >
                            {   
                                autoTags?.map(
                                    tag => (
                                        <p 
                                            onClick={e => autoComplete(e.target.innerText)}
                                            className={`ml-1 md:ml-4 selectable-text ${COLORS[tag.type]}`}
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

function TagSearchBar({setTags}) {
    const [inputTags, setInputTags] = useState('')
    const [autoTags, setAutoTags] = useState()
    const tags = useRef()

    useEffect(
        () => {
            tags.current = inputTags.toString().split(/\s+/)
            matchingTags()

        }, [inputTags]
    )

    const autoComplete = (tag) => {
        tags.current[tags.current.length - 1] = tag 
        setInputTags(tags.current.join(' '))
    }

    const matchingTags = () => {
        const tag = tags.current.at(-1)
        if (!tag.length) {
            return
        }
        api.get(`api/tags/get/?search=${tag}`)
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
                alert(error)
            }
        )

    }

    const handleAdd = (e) => {
        setTags(t => [...t, ...tags.current])
        tags.current = ''
        setInputTags('')
    }

    return (
        <>
            <div className="container relative w-full mb-4 md:mb-8">
                <div className="flex flex-row">   
                    <input 
                        type='text'
                        value={inputTags}
                        onChange={e => setInputTags(e.target.value)}
                        placeholder='Input tags to search'
                        className="rounded shadow w-full p-2 mr-2 shadow-transition focus:shadow-lg"
                    />
                    <button 
                        className="a-action-link-positive shadow-md py-1 md:py-2 px-3 md:px-6 "
                        onClick={handleAdd}
                        type="button"
                    >
                        Add
                    </button>
                </div>

                <div className="relative">
                    {
                        <div
                            className={
                                `${autoTags?.length >= 1 && inputTags.length ? '' : 'scale-y-0'} 
                                h-fit rounded shadow-md p-2 md:p-4 transition duration-100 popdown-menu bg-white`
                            }
                        >
                            {   
                                autoTags?.map(
                                    tag => (
                                        <p 
                                            onClick={e => autoComplete(e.target.innerText)}
                                            className={`ml-1 md:ml-4 selectable-text ${COLORS[tag.type]}`}
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