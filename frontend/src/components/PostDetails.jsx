import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'
import edit from '../assets/edit.png'

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';

const PostDetails = ({ userId, post })=>{

    const createdTimeStamp = new Date(post.createdAt);
    const [isLiked, setLiked] = useState(false);
    const [numLiked, setNumLiked] = useState(post.likes); // bound to be changed with backend
    const [isDisliked, setDisliked] = useState(false);    
    const [numDisliked, setNumDisliked] = useState(post.dislikes); // bound to be changed with backend

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

    
    const updated = post.createdAt != post.updatedAt;
    const updatedTimeStamp = new Date(post.updatedAt);
    const updatedYear = updatedTimeStamp.getFullYear();
    const updatedMonth = updatedTimeStamp.getMonth() + 1; // Months are zero-indexed
    const updatedDay = updatedTimeStamp.getDate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const CheckLikeDislike = async()=>{
            if (userId)
            {
                try
                {
                    const response = await axios.get(apiUrl + "/api/users/" + userId);
                        
                    // Check if the user has already liked the post
                    if (post.likedBy && post.likedBy.includes(userId)) {
                        console.log('You have already liked this post');
                        setLiked(true);
                    }  
                    if (post.disLikedBy && post.disLikedBy.includes(userId)) {
                        console.log('You have already disliked this post');
                        setDisliked(true);
                        
                    } 
                }
                catch (error)
                {
                    console.error('Error in fetching user data', error);
                }

               
        }

        CheckLikeDislike();

    }}, [])

    const Update_Post = async (newNumLiked, newNumDisliked) => {
        try {
            // Update the likes of the post
            if (post._id)
            {
                await axios.patch(apiUrl + '/api/posts/' + post._id, { ...post, likes: newNumLiked, dislikes: newNumDisliked});

            }

        } catch (error) {
            console.error('Error in editing Likes and Dislikes', error);
            
        }
    }

    const Like_Post = async (newNumLiked, newNumDisliked, like_or_unlike) => {
        try {
            // Update the likes of the post
            if (post._id)
            {
                await axios.patch(apiUrl+'/api/posts/' + post._id, { ...post, likes: newNumLiked, dislikes: newNumDisliked});
                if (like_or_unlike)
                {
                    await axios.patch(apiUrl+'/api/users/' + userId, { $push: {likedPosts: post._id }});  
                }     
                else
                {
                    await axios.patch(apiUrl+'/api/users/' + userId, { $pull: {likedPosts: post._id }});
                }       
            }

        } catch (error) {
            console.error('Error in editing Likes and Dislikes', error);
            
        }
    }
    
    const Dislike_Post = async (newNumLiked, newNumDisliked, dislike_or_unDislike) => {
        try {
            // Update the likes of the post
            if (post._id)
            {
                await axios.patch(apiUrl+'/api/posts/' + post._id, { ...post, likes: newNumLiked, dislikes: newNumDisliked });
                if (dislike_or_unDislike)
                {
                    await axios.patch(apiUrl+'/api/users/' + userId, {$push: {dislikedPosts: post._id }});
                }
                else
                {
                    await axios.patch(apiUrl+'/api/users/' + userId, {$pull: {dislikedPosts: post._id }});
                }
                
            }

        } catch (error) {
            console.error('Error in editing Likes and Dislikes', error);
            
        }
    }
    


    return (
        <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
            <div className='flex justify-between'>
                <div className='flex items-center'>
                                {/* example basis */}
            {/* example basis */}
                    <img src={post && post.user?.profpic ? apiUrl + "/api/uploads/actual/" + post.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                className="rounded-full cursor-pointer mr-2 max-w-xs max-h-xs w-8 h-8"
                                onClick={()=>navigate(`/Post/${post.user._id}`)}
                                />
                    <span onClick={()=>navigate(`/Post/${post.user._id}`)} className='cursor-pointer'>{post && post.user?.username && post.user.username}</span>
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
            <span className="text-teal-400 text-xs">{updated?"Edited on: "+ monthMap[updatedMonth]+" "+ updatedDay+", " + updatedYear :"Posted at: "+ monthMap[month]+" "+ day+", " + year}</span>
            <div className='flex flex-wrap'>
                {post.tags.length > 0 && post.tags.map((tag, index)=>(
                    <span key={index} className='bg-yellow-200 rounded-lg px-2 mr-1 mb-1 max-md:text-xs'>{tag}</span>
                ))} 
            </div>
            <p className='mt-2'>
                {post.desc}
            </p>
            
            <div className='bg-black w-full h-full flex flex-nowrap gap-2 items-center overflow-x-auto snap snap-x snap-mandatory scroll scroll-smooth rounded-sm'>
                {post.postedImages.map((image)=>(
                    <img key={image._id} src={apiUrl+"/api/uploads/actual/" + image.filename} className='w-full h-full rounded-sm snap-center'/>
                ))}
            </div>

            <div className="flex items-center justify-around mt-5">
                <div className="flex items-center justify-center">
                <button onClick={() => {
                    if(userId)
                    {
                        setLiked((prevToggle) => {
                            let newNumLiked = numLiked;
                            let newNumDisliked = numDisliked;
                            if (prevToggle) // if to stop like
                            {
                                newNumLiked = numLiked - 1;
                                post.likedBy = post.likedBy.filter(user => user !== userId)  
                                Like_Post(newNumLiked, newNumDisliked, false);                  
                            }
                            if (!prevToggle) // if liked
                            {
                                if (isDisliked)
                                {
                                    setNumDisliked(newNumDisliked - 1);
                                    newNumDisliked = newNumDisliked - 1;
                                    post.disLikedBy = post.disLikedBy.filter(user => user !== userId);
                                    console.log("ahahahahahah");
                                    Dislike_Post(newNumLiked, newNumDisliked, false);
                                }
                                setDisliked(false);
                                newNumLiked = numLiked + 1;
                                post.likedBy.push(userId);
                                Like_Post(newNumLiked, newNumDisliked, true);
                            }
                            setNumLiked(newNumLiked);
                            Update_Post(newNumLiked, newNumDisliked);
                            return !prevToggle;
                        });
                    }               
                    }} className='mr-1'>
                        <img src={isLiked ? coloredlike : like} width="12rem" height="12rem"/>
                    </button>
                    <span className='px-2 text-xs'>{numLiked}</span>
                    <button onClick={() => {
                        if(userId)
                        {
                            setDisliked((prevToggle)=>{
                                let newNumLiked = numLiked;
                                let newNumDisliked = numDisliked;
                                if (prevToggle) // if to stop dislike
                                {
                                    newNumDisliked = numDisliked - 1;
                                    post.disLikedBy = post.disLikedBy.filter(user => user !== userId) 
                                    Dislike_Post(newNumLiked, newNumDisliked, false);
                                }
                                if (!prevToggle) // if disliked
                                {
                                    if (isLiked)
                                    {
                                        setNumLiked(newNumLiked - 1);
                                        newNumLiked = newNumLiked - 1;
                                        post.likedBy = post.likedBy.filter(user => user !== userId);
                                        Like_Post(newNumLiked, newNumDisliked, false);
                                    }
                                    setLiked(false);
                                    newNumDisliked = numDisliked + 1;
                                    post.disLikedBy.push(userId);
                                    Dislike_Post(newNumLiked, newNumDisliked, true);
                                }
                                setNumDisliked(newNumDisliked);
                                Update_Post(newNumLiked, newNumDisliked);
                                return !prevToggle;
                            });               
                        }
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