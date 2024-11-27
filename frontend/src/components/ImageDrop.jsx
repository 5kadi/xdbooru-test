import { useState } from "react"





function ImageDrop({setImage}) {

    const [file, setFile] = useState(null)
    
    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(URL.createObjectURL(e.target.files[0]));
            setImage(e.target.files[0])
        }
    }

    return (
        <>
            <div className="w-full h-full shadow rounded p-1 md:p-2 flex relative flex-col group shadow-transition">
                {   
                    file ?
                        <img 
                            src={file}
                            className="w-full h-full object-contain object-center"
                        />
                    :   
                        <div className="flex justify-center items-center h-full">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-1/4 h-auto 
                                stroke-gray-400 group-hover:stroke-gray-500 transition duration-200"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                                />
                            </svg>

                        </div>

                
                }
                <input 
                    type='file'
                    //value={file ? file.name : null}
                    onChange={handleChange}
                    placeholder='Your image'
                    className="w-full h-full cursor-pointer absolute opacity-0"
                />   
            </div>  
        </>
    )

}

export default ImageDrop