import { useState } from 'react'

const EditPostForm = ( {post} )=>{

    return (  
        <>
            <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
                <form submit="">
                    <div className='flex'>
                        <img src={post && post.user?.profpic ? "http://localhost:3000/api/uploads/actual/" + post.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                className="rounded-full cursor-pointer mr-2"
                                width="25rem" height = "25rem"
                                />
                        <span>{post && post.user?.username && post.user.username}</span>
                    </div>
                    
                    <input type="text" name="title" className='rounded-lg px-2 text-2xl font-bold my-2 w-full' placeholder={post.title} defaultValue={post.title}/>
                    <div className='flex'>
                        <EditTag tagarr={post.tags}/>
                        {/* {post.tags.length > 0 && post.tags.map((tag)=>(
                            <span className='bg-yellow-200 rounded-lg px-2 mr-1'>{tag}</span>
                        ))}  */}
                    </div>
                    
                    <textarea name="desc" className='p-2 mt-5 mb-3 rounded-md w-full h-36 overflow-y-auto resize-none' defaultValue={post.desc}></textarea>

                    <div className='w-full h-full flex flex-nowrap gap-2 items-center overflow-x-auto snap snap-x snap-mandatory scroll scroll-smooth rounded-sm'>
                        {post.postedImages.map((image)=>(
                            <img key={image._id} src={"http://localhost:3000/api/uploads/actual/" + image.filename} className='w-full h-full rounded-sm snap-center'/>
                        ))}
                    </div>
                    <input type="submit" value = "Save" className='bg-primary text-white mt-5 px-2 pt-1 rounded-lg text-lg hover:shadow-lg mr-5'/>
                    <input type="submit" value = "Delete" className='bg-rose-500 text-white mt-5 px-2 pt-1 rounded-lg text-lg hover:shadow-lg'/>
                </form>
                
            </div>

        </>
    )
}

function EditTag({tagarr}) {
    const [tags, setTags] = useState(tagarr);
    const inputId = "tagInput"; // Define a constant for input id

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
  
     );
}

export default EditPostForm;