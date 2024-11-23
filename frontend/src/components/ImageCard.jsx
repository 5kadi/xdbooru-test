import '../styles/ImageCard.css'

function ImageCard({data}) {
    return (
        <a href={`/images/${data.id}/`}>
            <div 
                className='p-1 md:p-3 w-full h-40 flex justify-center items-center rounded shadow-transition'
            >
                <img 
                    src={data.image}
                    className='rounded object-contain w-full h-full bg-gray-50'
                    loading='lazy'
                />
            </div>
        </a>
        
    )
}

export default ImageCard