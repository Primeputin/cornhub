import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AllPosts = () => {

    const [posts, setPosts] = useState(null);
    const params = useParams();

    useEffect(()=>{
        const fetchPosts = async()=>{
            try 
            {
                const response = await axios.get("http://localhost:3000/api/posts/user/" + params.id);
                setPosts(response.data);
            
            }
            catch(error)
            {
                console.log("Error with getting data about the posts: ", error);
            }
            
        }

        fetchPosts();

    }, [])

    return (
        <>
            <div className='bg-secondary h-screen w-screen pt-28'>
                <div className='flex flex-col items-center justify-center bg-secondary'>
                    {posts && posts.map((post)=>(
                        <PostDetails key={post._id} post={post}/>

                    ))}
                </div>

            </div>
            

        </>
        
    )
}

export default Nav(AllPosts);