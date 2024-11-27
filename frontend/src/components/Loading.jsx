


function Loading() {

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center flex-col z-50 bg-white fixed">
                <img
                    className="object-contain w-2/3 md:w-1/4"
                    src="/loading.gif"
                />
                <h3 className="text-3xl mb-4">Loading...</h3>
            </div>
        </>
    )

}

export default Loading
