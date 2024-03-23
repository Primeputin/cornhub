import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPostForm = ( {post} )=>{

    const [title, setTitle] = useState(post.title);
    const [desc, setDesc] = useState(post.desc);
    const [tags, setTags] = useState(post.tags);

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const updatePost = async ()=>{

        try {
            // update the description of the post
            const response = await axios.patch(apiUrl+'/api/posts/' + post._id, { ...post, title: title, desc: desc, tags:tags});
            navigate("/Home");

        } catch (error) {
            console.error('Error in editing the information of the post', error);
        }

    }

    const onDelete = async()=>{
        try {
            const response = await axios.delete(apiUrl+'/api/posts/' + post._id);
            navigate("/Home");
        } catch (error) {
            console.error('Error deleting current post', error);
        }
    }

    const inputId = "tagInput";

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                setTags([...tags, value]);
                e.target.value = '';
            }
        }
    }

    function removeTag(index) {
        setTags(tags.filter((_, i) => i !== index));
    }


    return (  
        <>
            <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
                    <div className='flex'>
                        <img src={post && post.user?.profpic ? apiUrl+"/api/uploads/actual/" + post.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                className="rounded-full cursor-pointer mr-2"
                                width="25rem" height = "25rem"
                                />
                        <span>{post && post.user?.username && post.user.username}</span>
                    </div>
                    
                    <input onChange={(event)=>{setTitle(event.target.value)}} type="text" name="title" className='rounded-lg px-2 text-2xl font-bold my-2 w-full' placeholder={post.title} defaultValue={post.title}/>
                    
                    <div className='flex'>
                        
                    <div>
                    <div className="flex flex-wrap">
                        {tags.map((tag, index) => (
                        <div className="flex items-center mb-5 mr-5" key={index}>
                            <span className="bg-yellow-200 rounded-lg px-2 mr-1">{tag}</span>
                            <span className="bg-red-500 rounded-full p-2 text-white w-4 h-4 ml-0 flex items-center justify-center cursor-pointer" onClick={() => removeTag(index)}>&times;</span>
                        </div>
                        ))}
 
                    </div>

                <div>
                  <label className = "bg-primary text-white rounded-md px-2 py-1 mr-2" htmlFor={inputId}>Add a Tag: </label>
                  <input id={inputId} onKeyDown={handleKeyDown} type="text" className="rounded-md px-2" placeholder= "Type something" />
               </div>
                </div>
                    </div>
                    
                    <textarea onChange={(event)=>{setDesc(event.target.value)}} name="desc" className='p-2 mt-5 mb-3 rounded-md w-full h-36 overflow-y-auto resize-none' defaultValue={post.desc}></textarea>

                    <div className='bg-black w-full h-full flex flex-nowrap gap-2 items-center overflow-x-auto snap snap-x snap-mandatory scroll scroll-smooth rounded-sm'>
                        {post.postedImages.map((image)=>(
                            <img key={image._id} src={apiUrl+"/api/uploads/actual/" + image.filename} className='w-full h-full rounded-sm snap-center'/>
                        ))}
                    </div>
                    <input onClick={updatePost} type="submit" value = "Save" className='bg-primary text-white mt-5 px-2 pt-1 rounded-lg text-lg hover:shadow-lg mr-5'/>
                    <input onClick={onDelete} type="submit" value = "Delete" className='bg-rose-500 text-white mt-5 px-2 pt-1 rounded-lg text-lg hover:shadow-lg'/>
                
            </div>

        </>
    )
}

export default EditPostForm;