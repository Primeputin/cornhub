import reply from '../assets/reply.png'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CommentsDetails = ({userId, post})=>{

    const [commentBody, setCommentBody] = useState("");
    const [commentsState, setCommentsState] = useState(post.comments);
    const onComment = async ()=>{
        // new comment object
        const newComment = {
            user: userId,
            comment: commentBody,
            replies: [],
        };

        try {
            // Send HTTP request to create a new comment
            const response = await axios.post('http://localhost:3000/api/comments/', newComment);
            

            await axios.patch('http://localhost:3000/api/posts/' + post._id, {$push: { comments: response.data._id }});

            commentsState.unshift(response.data); // insert in the beginning of the array

            // Clear the textarea after successful submission
            setCommentBody('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }

        setCommentBody('');
    }

    const onDeleteComment = (commentId) => {
        // Filter out the deleted comment from the comments array
        setCommentsState(commentsState.filter(comment => comment._id !== commentId));
    };

    return (
        <>
             {/* sample comments */}
             <div className='p-5 w-full'>
                <h2 className='bg-primary rounded-t-lg px-5 text-white p-3 text-lg'>Comments</h2>
                <div className='flex flex-col w-full h-full bg-slate-100'>
                    
                   { userId && (
                        <div className='flex flex-col'>
                        <section className='bg-primary px-2 py-4'>
                            {/* create comment */}
                            <div>
                                <textarea value={commentBody}
                                onChange={(event)=>{setCommentBody(event.target.value)}}
                                className='bg-white p-2 resize-none rounded-md max-h-40 max-w-50 w-full overflow-y-auto'/>
                                <br/>
                                <button onClick={onComment} className="bg-secondary rounded-md px-2 text-sm" type="submit">
                                    Comment
                                </button>
                            </div>

                        </section>

                    </div>
                    )
                    }

                    <div className='flex flex-col'>
                        {commentsState && commentsState.map((comment)=>(
                            <CommentItem key={comment._id} userId={userId} comment={comment} onDeleteComment={onDeleteComment}/>
                        ))

                        }
                        
                        

                    </div>
                </div>
            </div>
        </>
    )
}

const CommentItem = ({userId, comment, onDeleteComment })=>{
    const navigate = useNavigate();
    const [commentState, setCommentState] = useState(comment);
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

    const [commentBody, setCommentBody] = useState('');
    const [repliesState, setRepliesState] = useState([...commentState.replies]);
    const onComment = async ()=>{
        // new comment object for the reply
        const newComment = {
            user: userId,
            comment: commentBody,
            replies: [],    
        };

        try {
            // Send HTTP request to create a new comment/reply
            const response = await axios.post('http://localhost:3000/api/comments/', newComment);

            // Get the newly created comment/reply from the response
            const createdComment = response.data;

            const newReplies = [...repliesState, createdComment._id]
            // update the comment being replied to
            await axios.patch('http://localhost:3000/api/comments/' + commentState._id, { replies: newReplies });
            // Update the comment being replied to
            setRepliesState(newReplies);

            fetchReplies(newReplies);

        } catch (error) {
            console.error('Error creating a reply:', error);
        }

        setCommentBody('');
        setIsReplying(false);

    }
    useEffect(()=>{
        
        fetchReplies(repliesState);
    }, [])
    const [isShowReplies, setIsShowReplies] = useState(false);


    // for the replies of the comment
    const [repliesData, setRepliesData] = useState([]);

    const fetchReplies = async (newRepliesState) => {
        try {
                // Fetch comment data for each reply ObjectId
                const promises = newRepliesState.map(async (replyId) => {
                    
                    const response = await axios.get(`http://localhost:3000/api/comments/${replyId}`);
                    return response.data;
                });
                const commentsData = await Promise.all(promises);
                setRepliesData(commentsData);
            
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

        

    const [isReplying, setIsReplying] = useState(false);


    const deleteComment = async()=>{

        try {
            // delete comment
            onDeleteComment(commentState._id); // to update the top level comment if ever
            await axios.delete('http://localhost:3000/api/comments/' + commentState._id);
            
            

        } catch (error) {
            console.error('Error deleting comment:', error);
        }

    }

    const onDeleteReplies = (commentId) => {
        // Filter out the deleted comment from the comments array
        
        const updatedState = repliesState.filter(objid => {
            return objid !== commentId;
        });
        
        setRepliesState(updatedState);
        fetchReplies(updatedState);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.comment);

    const onEdit = async ()=>{

        try {
            // update the comment being replied to
            const response = await axios.patch('http://localhost:3000/api/comments/' + commentState._id, { comment: editBody });
            setCommentState(response.data);
            // put parenthesis around or else js will get confused
            ({ year: updatedYear, month: updatedMonth, day: updatedDay, time: updatedTime } = getThreeTime(commentState.updatedAt));
            setUpdated(true) ;

        } catch (error) {
            console.error('Error in editing a comment', error);
        }

        setIsEditing(false);

    }

    return (
        <div>
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
                        <img src={comment && comment.user?.profpic ? "http://localhost:3000/api/uploads/actual/" + comment.user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                        className="rounded-full cursor-pointer p-1 mx-1 mr-2"
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
                        { userId && (
                        <button onClick={()=>setIsReplying((prev)=>!prev)} className='mr-1 mb-2 text-xs'>
                            <img src={reply} width="15rem" height="15rem"/>
                        </button>

                        )
                        }

                        { userId && comment.user?._id && userId === comment.user._id && (

                        <button onClick={()=>setIsEditing(true)} className='mr-1 mb-2 text-xs'>
                        <p className='underline underline-offset-2'> Edit </p>
                        </button>

                        )

                        }

                        { userId && comment.user?._id && userId === comment.user._id && (
                        <button onClick={deleteComment}className='mr-1 mb-2 text-xs hover:bg-rose-500 hover:text-white'>
                            <p className='underline underline-offset-2'> Delete </p>
                        </button>
                        
                        )

                        }



                        <button onClick={()=>setIsShowReplies((prev)=>!prev)} className='mr-1 mb-2 text-xs'>
                            <p className='underline underline-offset-2'> More replies </p>
                        </button>
                        
                    </div>

                </div>
            )}
           
            {/* reply to a comment */}
            {isReplying  && 
                (
                    <div className='px-2 py-4 bg-secondary'>
                        <textarea
                        onChange={(event)=>{setCommentBody(event.target.value)}}
                        className='bg-white p-2 resize-none rounded-md max-h-40 max-w-50 w-full overflow-y-auto'/>
                        <br/>
                        <button onClick={onComment} className="bg-primary text-white rounded-md px-2 text-xs" type="submit">
                            Comment
                        </button>
                        <button onClick={()=>setIsReplying(false)} className="bg-primary text-white rounded-md px-2 text-xs ml-4" type="submit">
                            Cancel
                        </button>
                    </div>
                )
            }

            {isShowReplies && repliesData && repliesData.map(reply => (
                <div className='ml-2' key={`reply-${reply._id}`}>
                    <CommentItem  comment={reply} userId={userId} onDeleteComment={onDeleteReplies}/>
                    
                </div>
            ))}
           
  
            
        </div>

    )
}


export default CommentsDetails;