import { SearchBar } from "../components/SearchBars"


function Home() {

    return (
        <>  
            <div className="flex flex-col justify-center items-center h-screen w-4/6 mx-auto">
                <h1 className="text-cyan-300 text-3xl md:text-6xl font-bold">XdBooru</h1><br/>
                <SearchBar></SearchBar>
            </div>
        </>
    )
}

export default Home