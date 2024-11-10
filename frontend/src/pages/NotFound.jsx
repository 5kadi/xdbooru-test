import NavMenu from "../components/NavMenu"



function NotFound() {
    return (
        <>
            <NavMenu/>
            <div className="flex justify-center items-center h-[60vh]">
                <h1 className="text-red-500 text-3xl text-center font-bold flex flex-col">
                    <span>ERROR 404</span>
                    This page doesn't exist!
                </h1>
            </div>
        </>
    )
}

export default NotFound