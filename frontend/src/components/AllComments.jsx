import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AllComments = () => {

    // for comments
    const [comments, setComments] = useState(null);
    const params = useParams();

    const fetchComments = async()=>{
        try{
            const response = await fetch(`http://localhost:3000/api/comments/user/` + params.id);
            if (response.ok)
            {
                const json = await response.json();
                setComments(json);
            }
        }
        catch (error)
        {
            console.error("Error fetching post:", error);
        }
    }

    useEffect(()=>{
        
        fetchComments();
    }, [])

    return (
        <div className='h-screen w-screen bg-secondary pt-24'>
       
            
            <div className='bg-secondary w-full'>
                 <h1 className='p-5 xs:max-lg:text-md'>Latest Comments</h1>

            </div>
            
           
            <div className='flex flex-col items-center justify-center bg-secondary'>
                    
                    {comments && comments.map((comment)=>{
                        return (
                            <SingleComment key={comment._id} comment={comment} refresh={fetchComments}/>
                        )
                    })}
            </div>
        </div>
    )
}


const SingleComment = ({ comment, refresh })=>{

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


    const deleteComment = async()=>{

        try {
            // future: still needs to check the replies of the comments that will be affected
            // also the comments that the comment is replied to
            await axios.delete('http://localhost:3000/api/comments/' + commentState._id);  
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
            const response = await axios.patch('http://localhost:3000/api/comments/' + commentState._id, { comment: editBody });
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
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                        className="rounded-full cursor-pointer p-1 mx-1 mr-2"
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
                            <p>{commentState.comment}</p>
                            
                        </div>
                        
                        

                    </section>

                    <div className='bg-tertiary flex justify-around'> 
                        <button onClick={()=>setIsEditing(true)} className='mr-1 mb-2 text-xs'>
                            <p className='underline underline-offset-2'> Edit </p>
                        </button>
                        <button onClick={deleteComment} className='mr-1 mb-2 text-xs hover:bg-rose-500 hover:text-white'>
                            <p className='underline underline-offset-2'> Delete </p>
                        </button>
                        
                    </div>

                </div>
            )}
           
  
            
        </div>

    )
}

export default Nav(AllComments);