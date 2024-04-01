import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../hocs';

const AllPosts = () => {

    const [posts, setPosts] = useState(null);
    const params = useParams();
    const { userId } = useContext(AuthContext);
    const apiUrl = import.meta.env.VITE_API_URL;

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

    }, [userId])

    return (
        <>
            <div className='bg-secondary h-screen w-screen pt-28'>
                <div className='flex flex-col items-center justify-center bg-secondary'>
                    {posts && posts.map((post)=>(
                        <PostDetails key={post._id} userId={userId} post={post}/>

                    ))}
                </div>

            </div>
            

        </>
        
    )
}

export default Nav(AllPosts);