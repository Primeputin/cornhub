import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect } from 'react'

const Home = () => {

    const [posts, setPosts] = useState(null);
    useEffect(()=>{
        const fetchPosts = async()=>{
            const response = await fetch("http://localhost:3000/api/posts/"); // it will forward/ proxy this to localhost:3000 which is the nodejs server defined in the package.json
            if (response.ok)
            {
                const json = await response.json();
                setPosts(json);
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

export default Nav(Home);