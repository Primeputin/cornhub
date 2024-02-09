import reply from '../assets/reply.png'

import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsDetails = ({comments})=>{

    const [commentBody, setCommentBody] = useState('');

    const onComment = async ()=>{
        // new comment object
        const newComment = {
            comment: commentBody,
            replies: [],
        };

        try {
            // Send HTTP request to create a new comment
            await axios.post('http://localhost:3000/api/comments/', newComment);

            // Clear the textarea after successful submission
            setCommentBody('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }

        comments.unshift(newComment); // insert in the beginning of the array
        setCommentBody('');
    }

    return (
        <>
             {/* sample comments */}
             <div className='p-5 w-full'>
                <h2 className='bg-primary rounded-t-lg px-5 text-white p-3 text-lg'>Comments</h2>
                <div className='flex flex-col w-full h-full bg-slate-100'>
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

                    <div className='flex flex-col'>
                        {comments && comments.map((comment)=>(
                            <CommentItem key={comment._id} comment={comment}/>
                        ))

                        }
                        
                        

                    </div>
                </div>
            </div>
        </>
    )
}

const CommentItem = ({comment})=>{
    const createdTimeStamp = new Date(comment.createdAt);

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

    const [commentBody, setCommentBody] = useState('');
    const [repliesState, setRepliesState] = useState([]);
    const onComment = async ()=>{
        // new comment object for the reply
        const newComment = {
            comment: commentBody,
            replies: [],
        };

        try {
            // Send HTTP request to create a new comment/reply
            const response = await axios.post('http://localhost:3000/api/comments/', newComment);

            // Get the newly created comment/reply from the response
            const createdComment = response.data;

            // Update the comment being replied to
            comment.replies.push(createdComment._id);
            // update the comment being replied to
            await axios.patch('http://localhost:3000/api/comments/' + comment._id, { replies: comment.replies });
            setRepliesState([...comment.replies]);


        } catch (error) {
            console.error('Error creating a reply:', error);
        }

        setCommentBody('');
        setIsReplying(false);

    }
    const [isShowReplies, setIsShowReplies] = useState(false);


    // for the replies of the comment
    const [repliesData, setRepliesData] = useState([]);
    useEffect (()=>{

        const fetchReplies = async () => {
            try {
                if (isShowReplies) {
                    // Fetch comment data for each reply ObjectId
                    const promises = comment.replies.map(async (replyId) => {
                        console.log(replyId)
                        const response = await axios.get(`http://localhost:3000/api/comments/${replyId}`);
                        return response.data;
                    });
                    const commentsData = await Promise.all(promises);
                    setRepliesData(commentsData);
                }
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        };
        fetchReplies();
    }, [repliesState, isShowReplies]);

    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const deleteComment = async()=>{

        try {
            // delete comment
            await axios.delete('http://localhost:3000/api/comments/' + comment._id);
            comment.replies = comment.replies.filter(item => item !== comment._id);
            setRepliesState([...comment.replies]);


        } catch (error) {
            console.error('Error deleting comment:', error);
        }

    }

    return (
        <div>
            <section className='bg-tertiary flex items-center py-2'>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                className="rounded-full cursor-pointer p-1 mx-1 mr-2"
                width="50"
                height="50"/>
                <div className='flex flex-col'>
                    <span className="text-teal-400 text-xs">Commented at: {monthMap[month]} {day}, {year}</span>
                    <p>{comment.comment}</p>
                </div>
                
                

            </section>

            <div className='bg-tertiary flex justify-around'> 
                <button onClick={()=>setIsReplying((prev)=>!prev)} className='mr-1 mb-2 text-xs'>
                    <img src={reply} width="15rem" height="15rem"/>
                </button>
                <button onClick={()=>setIsEditing((prev)=>!prev)} className='mr-1 mb-2 text-xs'>
                    <p className='underline underline-offset-2'> Edit </p>
                </button>
                <button onClick={deleteComment}className='mr-1 mb-2 text-xs'>
                    <p className='underline underline-offset-2'> Delete </p>
                </button>
                <button onClick={()=>setIsShowReplies((prev)=>!prev)} className='mr-1 mb-2 text-xs'>
                    <p className='underline underline-offset-2'> More replies </p>
                </button>
                
            </div>

            {/* reply to a comment */}
            {isReplying && 
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
                    <CommentItem comment={reply} />
                </div>
            ))}
           
  
            
        </div>

    )
}


export default CommentsDetails;