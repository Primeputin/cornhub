import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'
import edit from '../assets/edit.png'

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

const PostDetails = ({ userId, post })=>{

    const createdTimeStamp = new Date(post.createdAt);
    const [isLiked, setLiked] = useState(false);
    const [numLiked, setNumLiked] = useState(0); // bound to be changed with backend
    const [isDisliked, setDisliked] = useState(false);    
    const [numDisliked, setNumDisliked] = useState(0); // bound to be changed with backend

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
                    <img src={post && post.user?.profpic ? "http://localhost:3000/api/uploads/actual/" + post.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                className="rounded-full cursor-pointer mr-2"
                                width="25rem" height = "25rem"
                                />
                    <span>{post && post.user?.username && post.user.username}</span>
                </div>
                
                { userId && post.user?._id && userId === post.user._id && (


                    <button className='bg-tertiary' onClick={()=>navigate(`/EditPost/${post._id}`)}>
                        <img src={edit}
                                    className="rounded-full cursor-pointer"
                                    width="15rem" height = "15rem"
                                    />
                    </button>
                )

                }
                
                
            </div>
            
            <h4 onClick={()=>navigate(`/SinglePost/${post._id}`)} className="text-2xl font-bold cursor-pointer hover:text-primary">{post.title}</h4>
            <span className="text-teal-400 text-xs">Posted at: {monthMap[month]} {day}, {year}</span>
            <div className='flex flex-wrap'>
                {post.tags.length > 0 && post.tags.map((tag, index)=>(
                    <span key={index} className='bg-yellow-200 rounded-lg px-2 mr-1 mb-1 max-md:text-xs'>{tag}</span>
                ))} 
            </div>
            <p className='mt-2'>
                {post.desc}
            </p>
            
            <div className='w-full h-full flex flex-nowrap gap-2 items-center overflow-x-auto snap snap-x snap-mandatory scroll scroll-smooth rounded-sm'>
                {post.postedImages.map((image)=>(
                    <img key={image._id} src={"http://localhost:3000/api/uploads/actual/" + image.filename} className='w-full h-full rounded-sm snap-center'/>
                ))}
            </div>

            <div className="flex items-center justify-around mt-5">
                <div className="flex items-center justify-center">
                    <button onClick={() => {
                            setLiked((prevToggle) => 
                            {
                                
                                if (prevToggle) // if to stop like
                                {
                                    setNumLiked(numLiked - 1);
                                }
                                if (!prevToggle) // if liked
                                {
                                    if (isDisliked)
                                    {
                                        setNumDisliked(numDisliked - 1);
                                    }

                                    setDisliked(false);
                                    setNumLiked(numLiked + 1)
                                }
                                return !prevToggle;
                            });
                    }} className='mr-1'>
                        <img src={isLiked ? coloredlike : like} width="12rem" height="12rem"/>
                    </button>
                    <span className='px-2 text-xs'>{numLiked}</span>
                    <button onClick={() => {
                        setDisliked((prevToggle)=>{
                            if (prevToggle) // if to stop dislike
                            {
                                setNumDisliked(numDisliked - 1)
                            }
                            if (!prevToggle) // if disliked
                            {
                                if (isLiked)
                                {
                                    setNumLiked(numLiked - 1);
                                }

                                setLiked(false);
                                setNumDisliked(numDisliked + 1)
                            }
                            return !prevToggle;
                        });
                    }}>
                        <img src={isDisliked ? coloreddislike : dislike} width="12rem" height="12rem"/>
                    </button>
                    <span className='px-2 text-xs'>{numDisliked}</span>
                </div>
                <button className='text-xs' onClick={()=>navigate(`/SinglePost/${post._id}`)}>Comment</button>
            </div>
        </div>
    )
}
export default PostDetails;