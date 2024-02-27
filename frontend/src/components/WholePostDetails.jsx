import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'

import { AuthContext } from '../hocs';
import edit from '../assets/edit.png'
import CommentsDetails from './CommentsDetails'

import { useNavigate } from 'react-router-dom';

import { useState, useEffect , useContext} from 'react';

const WholePostDetails = ( {post} )=>{

    const createdTimeStamp = new Date(post.createdAt);
    const [isLiked, setLiked] = useState(false);
    const [isDisliked, setDisliked] = useState(false);

    const { userId } = useContext(AuthContext);

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

    return (
        <>
            <div className="bg-tertiary px-5 pt-5 pb-3 rounded-lg max-w-xl w-1/2 my-5 shadow-lg">
                <div className='flex justify-between'>
                    <div className="flex items-center">
                    <img src={post && post.user?.profpic ? "http://localhost:3000/api/uploads/actual/" + post.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                            className="rounded-full cursor-pointer mr-2 max-w-xs max-h-xs w-8 h-8"
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
                
                

                <h4 className="text-2xl font-bold">{post.title}</h4>
                <span className="text-teal-400 text-xs">{updated?"Edited on: "+ monthMap[updatedMonth]+" "+ updatedDay+", " + updatedYear :"Posted at: "+ monthMap[month]+" "+ day+", " + year}</span>
                <div className='flex'>
                    {post.tags.length > 0 && post.tags.map((tag, index)=>(
                        <span key={index} className='bg-yellow-200 rounded-lg px-2 mr-1'>{tag}</span>
                    ))} 
                </div>
                <p className='mt-2'>
                    {post.desc}
                </p>
                
                <div className='bg-black w-full h-full flex flex-nowrap gap-2 items-center overflow-x-auto snap snap-x snap-mandatory scroll scroll-smooth rounded-sm'>
                    {post.postedImages.map((image)=>(
                        <img key={image._id} src={"http://localhost:3000/api/uploads/actual/" + image.filename} className='w-full h-full rounded-sm snap-center'/>
                    ))}
                </div>
                <div className="flex items-center justify-around mt-5">
                    <div className="flex items-center justify-center">
                        <button onClick={() => setLiked((prevToggle) => !prevToggle)} className='mr-1'>
                            <img src={isLiked ? coloredlike : like} width="15rem" height="15rem"/>
                        </button>
                        <button onClick={() => setDisliked((prevToggle) => !prevToggle)}>
                            <img src={isDisliked ? coloreddislike : dislike} width="15rem" height="15rem"/>
                        </button>
                    </div>
                </div>
            </div>

            <CommentsDetails post={post} userId={userId}/>
            
        </>
    )
}
export default WholePostDetails;