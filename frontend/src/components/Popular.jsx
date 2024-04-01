import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../hocs';

const Popular = () => {

    const { userId } = useContext(AuthContext);
    const [posts, setPosts] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const fetchPosts = async()=>{
            const response = await fetch(apiUrl+"/api/posts/"); // it will forward/ proxy this to localhost:3000 which is the nodejs server defined in the package.json
            if (response.ok)
            {
                const json = await response.json();
                json.sort((postA, postB) => postB.likes - postA.likes); // sort in descending order of likes
                json.sort((postA, postB) => postA.dislikes - postB.dislikes); // sort in ascending order of dislikes   
                setPosts(json);
            }
        }

        fetchPosts();

    }, [userId])

    return (
        <>
            <div className='bg-secondary h-screen w-screen pt-28'>
                <div className='flex flex-col items-center justify-center bg-secondary'>
                    {posts && (userId ? posts : posts.slice(0, 16)).map((post)=>(
                        <PostDetails key={post._id} userId={userId} post={post}/>

                    ))}
                </div>

            </div>
            

        </>
        
    )
}

export default Nav(Popular);
