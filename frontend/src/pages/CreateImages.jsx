import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import NavMenu from "../components/NavMenu"
import { AddTagSearchBar } from "../components/SearchBars"
import ImageDrop from "../components/ImageDrop"
import ResizingTextarea from "../components/ResizingTextarea"
import TagList from "../components/TagList"

function CreateImages() {
    const [file, setFile] = useState()
    const [tags, setTags] = useState([])
    const [description, setDescription] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (tags.length && description.length && file) {
            const strTags = tags.join('+')
            const formData = new FormData()

            formData.append('image', file)
            formData.append('description', description),
            formData.append('tags', strTags) //TODO: pass as an array

            const config = {
                'content-type': 'multipart/form-data'
            }
           
            api.post(
                'api/images/create/',
                formData,
                config
            )
            .then(
                response => {
                    if (response.status === 201) {
                        navigate(`/images/${response.data.id}`)
                    }
                    console.log(response.data)
                    
                }
            )
            .catch(
                error => {
                    alert(error)
                }
            )
            return
        }
        //alert('error')  //TODO: handle errors
    }

    return (
        <>      
            <NavMenu></NavMenu>
            <div className="mx-6 md:mx-12 h-fit mb-12 ">
                <h1
                    className="text-2xl md:text-3xl text-cyan-300 font-bold mb-4 md:mb-8 text-center"  
                >
                    You can create some images here!
                </h1>
                <form 
                    onSubmit={handleSubmit}
                    className="flex flex-col h-fit"
                >   
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            className="col-span-1 flex flex-col"
                        >   
                            <div className="mb-2 md:mb-4 h-[60vh]">
                                <ImageDrop setImage={setFile}/>
                            </div>
                            <div className="mb-4 md:mb-8">
                                <ResizingTextarea setText={setDescription} placeholder={'Your description'}/>
                            </div> 
                        </div>
                        <div
                            className="col-span-1 mb-6 md:mb-12"
                        >   
                            <AddTagSearchBar setTags={setTags}/>
                            {
                                tags.length >= 1 && <TagList tags={tags}/>
                            }
                        </div>
                    </div>
                    <button 
                        type='submit'
                        className={
                            `${!(tags.length && description.length && file) ? 'a-action-link-negative' : 'a-action-link-positive'}
                            py-2 px-12 w-1/2 self-center fixed bottom-4`
                        }
                    > 
                        Create Image!
                    </button>
                </form>   
            </div>

        </>
    )
}

export default CreateImages