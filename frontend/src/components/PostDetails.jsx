import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'

import { useState } from 'react'

const PostDetails = ({ post })=>{

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
        <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
            <div className='flex'>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                            className="rounded-full cursor-pointer mr-2"
                            width="25rem" height = "25rem"
                            />
                <span>Username</span>
            </div>
            
            <h4 className="text-2xl font-bold">{post.title}</h4>
            <span className="text-teal-400 text-xs">Posted at: {monthMap[month]} {day}, {year}</span>
            <p className='mt-2'>
                {post.desc}
            </p>
            <div className="flex items-center justify-around mt-5">
                <div className="flex items-center justify-center">
                    <button onClick={() => setLiked((prevToggle) => !prevToggle)} className='mr-1'>
                        <img src={isLiked ? coloredlike : like} width="15rem" height="15rem"/>
                    </button>
                    <button onClick={() => setDisliked((prevToggle) => !prevToggle)}>
                        <img src={isDisliked ? coloreddislike : dislike} width="15rem" height="15rem"/>
                    </button>
                </div>
                <button className='text-xs'>Comment</button>
            </div>
        </div>
    )
}
export default PostDetails;