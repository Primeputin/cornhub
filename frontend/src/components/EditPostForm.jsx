import { useState } from 'react'

const EditPostForm = ( {post} )=>{

    const createdTimeStamp = new Date(post.createdAt);
    const [isLiked, setLiked] = useState(false);
    const [isDisliked, setDisliked] = useState(false);

    // Extracting date components
    const year = createdTimeStamp.getFullYear();
    const month = createdTimeStamp.getMonth() + 1; // Months are zero-indexed
    const day = createdTimeStamp.getDate();

    const monthMap = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
      };

    return (  
        <>
            <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
                <form submit="">
                    <div className='flex'>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                                    className="rounded-full cursor-pointer mr-2"
                                    width="25rem" height = "25rem"
                                    />
                        <span>Username</span>
                    </div>
                    
                    <input type="text" name="title" className='rounded-lg px-2 text-2xl font-bold my-2 w-full' placeholder={post.title} value={post.title}/>
                    <div className='flex'>
                        {post.tags.length > 0 && post.tags.map((tag)=>(
                            <span className='bg-yellow-200 rounded-lg px-2 mr-1'>{tag}</span>
                        ))} 
                    </div>
                    <textarea name="desc" className='p-2 mt-5 mb-3 rounded-md w-full h-36 overflow-y-auto resize-none' defaultValue={post.desc}></textarea>

                    {/* hardcoded image for now */}
                    <img src='https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg' className='w-full h-full rounded-sm'/>
                    <input type="submit" value = "Save" className='bg-primary text-white mt-5 px-2 pt-1 rounded-lg text-lg hover:shadow-lg'/>
                </form>
                
            </div>

        </>
    )
}
export default EditPostForm;