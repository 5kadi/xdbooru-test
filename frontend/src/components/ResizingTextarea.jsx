import { useEffect, useRef } from "react"


function ResizingTextarea({textState, setText, placeholder}) {

    const textAreaRef = useRef()

    useEffect(
        () => {
            textAreaRef.current.style.height = 'auto'
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
        }, [textState]
    )

    const handleChange = (text) => {
        setText(text)
        textAreaRef.current.style.height = 'auto'
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    }

    return (
        <>
            <textarea
                value={textState}
                onChange={e => handleChange(e.target.value)}
                ref={textAreaRef}
                placeholder={placeholder}
                className="rounded shadow w-full p-1 md:p-2 resize-none mb-1 md:mb-2 shadow-transition focus:shadow-lg"
                rows={1}
            />
        </>
    )
}

export default ResizingTextarea