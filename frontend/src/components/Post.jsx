import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../hocs';

const Post = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const params = useParams();
    const { userId } = useContext(AuthContext);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        
        const fetchUser = async()=>{
            try 
            {
                const response = await axios.get(apiUrl+"/api/users/" + params.id);
                setUser(response.data);
            
            }
            catch(error)
            {
                console.log("Error with getting data about the user: ", error);
            }
            
        }

        fetchUser();
    
    }, []);

    useEffect(()=>{
        const fetchPosts = async()=>{
            try 
            {
                const response = await axios.get(apiUrl+"/api/posts/user/" + params.id);
                setPosts(response.data);
            
            }
            catch(error)
            {
                console.log("Error with getting data about the posts: ", error);
            }
            
        }

        fetchPosts();

    }, [])

    // for comments
    const [comments, setComments] = useState(null);

    const fetchComments = async()=>{
        try 
        {
            const response = await axios.get(apiUrl+"/api/comments/user/" + params.id);
            setComments(response.data);
        
        }
        catch(error)
        {
            console.log("Error with getting data about the comments: ", error);
        }
        
    }

    useEffect(()=>{
        

        fetchComments();

    }, [])

    return (
        <div className='h-screen w-screen bg-secondary pt-24'>
            <div className='flex items-center justify-center bg-secondary'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src={user && user.profpic ? apiUrl+"/api/uploads/actual/" + user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                             className="rounded-full cursor-pointer max-w-md max-h-md w-32 h-32"
                        />
                        <span>{user && user.username}</span>
                    </div>
                    
                    <div className='p-5 mx-9 bg-tertiary rounded-md'>
                            {user && user.desc ? user.desc : "My description"}
                    </div>

            </div>
            <h1 className='bg-secondary m-5 xs:max-lg:text-md'>Latest Posts</h1>
            {/* random number for now */}
            <button onClick={()=>{navigate('/AllPosts/' + user._id)}} className='ml-5 mt-1 bg-primary text-white'>All posts</button>

            
            <div className='flex flex-col items-center justify-center bg-secondary'>
                    
                    {posts && posts.slice(0, 3).map((post)=>(
                        <PostDetails key={post._id} userId={userId} post={post}/>

                    ))}
            </div>
            
            <div className='bg-secondary w-full'>
                 <h1 className='p-5 xs:max-lg:text-md'>Latest Comments</h1>
                 {/* random number for now */}
                 <button onClick={()=>{navigate('/AllComments/' +  user._id)}} className='ml-5 mt-1 mb-3 bg-primary text-white'>All comments</button>

            </div>
            
           
            <div className='flex flex-col items-center justify-center bg-secondary'>
                    
                    {comments && comments.slice(0, 3).map((comment)=>{
                        return (
                            <SingleComment key={comment._id} comment={comment} refresh={fetchComments}/>
                        )
                    })}
            </div>
        </div>
    )
}


const SingleComment = ({ comment, refresh })=>{

    const navigate = useNavigate();
    const [commentState, setCommentState] = useState(comment);
    const { userId } = useContext(AuthContext);

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const getThreeTime = (timeString)=>{
        const createdTimeStamp = new Date(timeString);

        // Extracting date components
        const year = createdTimeStamp.getFullYear();
        const month = createdTimeStamp.getMonth() + 1; // Months are zero-indexed
        const day = createdTimeStamp.getDate();
        const time = createdTimeStamp.getTime();

        return {
            year: year,
            month: month,
            day: day,
            time: time,
        }
    }

    const { year, month, day, time } = getThreeTime(comment.createdAt);
    let { year: updatedYear, month: updatedMonth, day: updatedDay, time: updatedTime } = getThreeTime(comment.updatedAt);
    const [isUpdated, setUpdated] = useState(day !== updatedDay || month !== updatedMonth || year !== updatedYear || time !== updatedTime);

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


    const deleteComment = async()=>{

        try {
            // future: still needs to check the replies of the comments that will be affected
            // also the comments that the comment is replied to
            await axios.delete(apiUrl+'/api/comments/' + commentState._id);  
            refresh();   
            

        } catch (error) {
            console.error('Error deleting comment:', error);
        }

    }

    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState('');

    const onEdit = async ()=>{

        try {
            // update the comment being replied to
            const response = await axios.patch(apiUrl+'/api/comments/' + commentState._id, { comment: editBody });
            setCommentState(response.data);
            // put parenthesis around or else js will get confused
            ({ year: updatedYear, month: updatedMonth, day: updatedDay, time: updatedTime } = getThreeTime(commentState.updatedAt));
            setUpdated(true) ;

        } catch (error) {
            console.error('Error in editing a comment', error);
        }

        setEditBody('');
        setIsEditing(false);

    }

    


    return (
        <div className='w-full'>
            {isEditing ? (
                <div>
                    <div>
                        <div className='bg-secondary px-2 py-4'>
                           
                            <textarea
                                onChange={(event)=>{setEditBody(event.target.value)}}
                                defaultValue={commentState.comment}
                                className='bg-white p-2 resize-none rounded-md max-h-40 max-w-50 w-full overflow-y-auto'/>
                            <br/>
                        </div>
                        

                        <div className='bg-secondary flex justify-around'> 

                            <button onClick={()=>{
                                onEdit();
                                setIsEditing(false);
                            }} className='mr-1 my-2 text-xs hover:bg-primary hover:text-white'>
                                <p className='underline underline-offset-2'> Save </p>
                            </button>
                            <button onClick={()=>setIsEditing(false)} className='mr-1 my-2 text-xs text-xs hover:bg-rose-500 hover:text-white'>
                                <p className='underline underline-offset-2'> Cancel </p>
                            </button>
                            
                        </div>

                    </div>
                </div>


            ) : (
                <div>
                     <section className='bg-tertiary flex items-center py-2'>
                        <img src={comment && comment.user?.profpic ? apiUrl+"/api/uploads/actual/" + comment.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                        className="rounded-full cursor-pointer mr-2 max-w-xs max-h-xs w-8 h-8"
                        onClick={()=>navigate(`/Post/${comment.user._id}`)}
                        width="50"
                        height="50"/>
                        <div className='flex flex-col'>
                            {
                                isUpdated ? 
                                (
                                    <span className="text-teal-400 text-xs">
                                        Edited at: {monthMap[updatedMonth]} {updatedDay}, {updatedYear}
                                    </span>
                                ):
                                (
                                    <span className="text-teal-400 text-xs">
                                        Commented at: {monthMap[month]} {day}, {year}
                                    </span>
                                )

                            }
                            <span onClick={()=>navigate(`/Post/${comment.user._id}`)} className='cursor-pointer font-bold'>{comment && comment.user?.username && comment.user.username}</span>
                            <p>{commentState.comment}</p>
                            
                        </div>
                        
                        

                    </section>

                    <div className='bg-tertiary flex justify-around'> 
                        { userId && comment.user?._id && userId === comment.user._id && (

                            <button onClick={()=>setIsEditing(true)} className='mr-1 mb-2 text-xs'>
                            <p className='underline underline-offset-2'> Edit </p>
                            </button>

                        )}
                        { userId && comment.user?._id && userId === comment.user._id && (

                            <button onClick={deleteComment} className='mr-1 mb-2 text-xs hover:bg-rose-500 hover:text-white'>
                            <p className='underline underline-offset-2'> Delete </p>
                            </button>
                        )}

                        
                        
                    </div>

                </div>
            )}
           
  
            
        </div>

    )
}

export default Nav(Post);