import { useState } from "react"
import { withProtection } from "../utils/Protection"
import { USER_DATA } from "../constants"





function NavMenu({isAuthorized}) {

    const [hover, setHover] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row md:py-2 px-4 font-sans mx-auto mb-2">
                <a 
                    className="text-3xl text-center md:text-5xl text-cyan-300 font-bold md:float-left md:mr-12 cursor-pointer"
                    href="/"
                >
                    XdBooru
                </a>
                <nav className="text-lg md:text-2xl md:gap-2 flex justify-between w-full">
                    <div className="flex flex-row">
                        <a href="/images" className="a-nav-link">Images</a>
                        <a href="/tags" className="a-nav-link">Tags</a>
                        <div 
                            className={`a-nav-link`}
                            onClick={e => setHover(h => !h)}
                        >
                            <p className="grid grid-cols-5 text-center"> 
                                {
                                    hover ? 
                                        <span className="col-span-1">&#129171;</span> 
                                    : 
                                        <span className="col-span-1">&#129170;</span>
                                } <span className="col-span-4">Create</span>
                            </p>
                            <div className={`relative h-auto text-xl`}>
                                <div  
                                    className={`${!hover && 'scale-y-0'} popdown-menu transition duration-100
                                    flex flex-col shadow-md rounded h-fit bg-white z-10`}
                                >
                                    <a href="/images/create" className="a-nav-link">Images</a>
                                    <a href="/tags/create" className="a-nav-link">Tags</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-[35%] text-sm md:text-xl my-auto overflow-clip">
                        {
                            isAuthorized ? 
                                <div className="grid grid-cols-4 group cursor-pointer">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1.5} 
                                        stroke="currentColor" 
                                        className="col-span-1 min-h-8 my-auto
                                        stroke-gray-400 group-hover:stroke-gray-500"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <a 
                                        href="/user/profile/" 
                                        className="col-span-3 my-auto p-1 md:p-2 text-gray-400 group-hover:text-gray-500 overflow-clip"
                                    >
                                        {JSON.parse(localStorage.getItem(USER_DATA)).username}
                                    </a>
                                </div>
                            : 
                                <div className="flex flex-row">
                                    <a href="/register" className="a-nav-link">Register</a>
                                    <a href="/login" className="a-nav-link">Log In</a>
                                </div>
                        }
                    </div>
                </nav>
            </div>
            <div class="bg-neutral-200 h-px mb-2 md:mb-4"></div>

        </>
    )
}

NavMenu = withProtection(NavMenu)

export default NavMenu