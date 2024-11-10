import { useEffect, useState } from "react"



function ErrorWindow({error, setError}) {

    useEffect(
        () => {
            console.log(error)
        }, []
    )

    return error && 
            <>
                <div className="w-full h-full bg-black fixed bg-opacity-25 flex justify-center items-center top-0 right-0 z-50">
                    <div className="bg-white w-2/3 md:w-1/3 h-[45%] rounded shadow-lg flex flex-col p-1 gap-4">
                        <div className="relative">
                            <h1 className="text-red-500 text-3xl font-bold text-center">ERROR</h1>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-[10%] h-auto stroke-gray-400 hover:stroke-gray-500 cursor-pointer 
                                absolute m-auto left-[90%] top-0"
                                onClick={e => setError(null)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="p-1 mx-[5%] break-words text-xl">
                            {
                                Object.values(error.response.data).map(
                                    msg => (
                                        <>{msg}</>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </>
}

export default ErrorWindow