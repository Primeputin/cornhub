import like from '../assets/like.jpeg'
import coloredlike from '../assets/coloredlike.png'
import dislike from '../assets/dislike.png'
import coloreddislike from '../assets/coloreddislike.png'
import reply from '../assets/reply.png'

import { useState } from 'react'

const WholePostDetails = ( {post} )=>{

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
                <div className='flex'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                                className="rounded-full cursor-pointer mr-2"
                                width="25rem" height = "25rem"
                                />
                    <span>Username</span>
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
                        <button onClick={() => setLiked((prevToggle) => !prevToggle)} className='mr-1'>
                            <img src={isLiked ? coloredlike : like} width="15rem" height="15rem"/>
                        </button>
                        <button onClick={() => setDisliked((prevToggle) => !prevToggle)}>
                            <img src={isDisliked ? coloreddislike : dislike} width="15rem" height="15rem"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* sample comments */}
            <div className='p-5 w-full'>
                <h2 className='bg-primary rounded-t-lg px-5 text-white p-3 text-lg'>Comments</h2>
                <div className='flex flex-col w-full h-full bg-slate-100'>
                   <div className='flex flex-col'>
                        <section className='bg-primary p-2'>
                            {/* create comment */}
                            <form action="">
                                <textarea name="desc" className='bg-white p-2 resize-none rounded-md max-h-40 max-w-50 w-full overflow-y-auto'>
                                </textarea>
                                <br/>
                                <input className="bg-secondary rounded-md px-2" type="submit" value="Comment"/>
                            </form>

                        </section>

                    </div>

                    <div className='flex flex-col'>
                        <section className='bg-tertiary flex items-center py-2'>
                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                            className="rounded-full cursor-pointer p-1 mx-1 mr-2"
                            width="50"
                            height="50"/>
                            <p>I also like corns!!!</p>

                        </section>
                        <div className='bg-tertiary flex justify-around'> 
                            <button className='mr-1 mb-2'>
                                <img src={reply} width="15rem" height="15rem"/>
                            </button>
                            <button className='mr-1 mb-2'>
                                <p className='underline underline-offset-2'> Edit </p>
                            </button>
                            <button className='mr-1 mb-2'>
                                <p className='underline underline-offset-2'> Delete </p>
                            </button>
                            <button className='mr-1 mb-2'>
                                <p className='underline underline-offset-2'> More replies </p>
                            </button>
                            
                        </div>
                        

                    </div>
                </div>
            </div>
        </>
    )
}
export default WholePostDetails;