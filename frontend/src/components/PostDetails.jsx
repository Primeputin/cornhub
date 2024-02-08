import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'
import edit from '../assets/edit.png'

import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

const PostDetails = ({ post })=>{

    const createdTimeStamp = new Date(post.createdAt);
    const [isLiked, setLiked] = useState(false);
    const [isDisliked, setDisliked] = useState(false);    

    const navigate = useNavigate();

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
        <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
            <div className='flex justify-between'>
                <div className='flex items-center'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                                className="rounded-full cursor-pointer mr-2"
                                width="25rem" height = "25rem"
                                />
                    <span>Username</span>
                </div>
                
                <button className='bg-tertiary' onClick={()=>navigate(`/EditPost/${post._id}`)}>
                    <img src={edit}
                                className="rounded-full cursor-pointer"
                                width="15rem" height = "15rem"
                                />
                </button>
                
            </div>
            
            <h4 className="text-2xl font-bold">{post.title}</h4>
            <span className="text-teal-400 text-xs">Posted at: {monthMap[month]} {day}, {year}</span>
            <div className='flex'>
                {post.tags.length > 0 && post.tags.map((tag)=>(
                    <span className='bg-yellow-200 rounded-lg px-2 mr-1'>{tag}</span>
                ))} 
            </div>
            <p className='mt-2'>
                {post.desc}
            </p>
            {/* hardcoded image for now */}
            <img src='https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg' className='w-full h-full rounded-sm'/>
            <div className="flex items-center justify-around mt-5">
                <div className="flex items-center justify-center">
                    <button onClick={() => {
                            setLiked((prevToggle) => 
                            {
                                if (!prevToggle) // if liked
                                {
                                    setDisliked(false);
                                }
                                return !prevToggle;
                            });
                    }} className='mr-1'>
                        <img src={isLiked ? coloredlike : like} width="15rem" height="15rem"/>
                    </button>
                    <button onClick={() => {
                        setDisliked((prevToggle)=>{
                            if (!prevToggle) // if disliked
                            {
                                setLiked(false);
                            }
                            return !prevToggle;
                        });
                    }}>
                        <img src={isDisliked ? coloreddislike : dislike} width="15rem" height="15rem"/>
                    </button>
                </div>
                <button className='text-xs' onClick={()=>navigate(`/SinglePost/${post._id}`)}>Comment</button>
            </div>
        </div>
    )
}
export default PostDetails;