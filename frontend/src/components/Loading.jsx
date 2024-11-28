


function Loading() {

    return (
        <>
            <div className="w-full h-full bg-black fixed bg-opacity-25 flex justify-center items-center top-0 right-0 z-50">
                <div className="w-2/3 md:w-1/5 flex flex-col bg-white rounded shadow-lg p-3">
                    <img
                        className="object-contain "
                        src="/loading.gif"
                    />
                    <h3 className="text-3xl text-center">Loading...</h3>
                </div>
            </div>
        </>
    )

}

export default Loading