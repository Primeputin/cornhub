import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect } from 'react'

const Post = () => {

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
        <div className='h-screen w-screen bg-secondary pt-24'>
            <div className='flex items-center justify-center bg-secondary'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                            className="rounded-full cursor-pointer"
                            width="150" height = "150"
                            />
                        <span>Username</span>
                    </div>
                    
                    <div className='p-5 mx-9 bg-tertiary rounded-md'>
                            My description
                    </div>

            </div>
            <div className='flex flex-col items-center justify-center bg-secondary'>
                    {posts && posts.map((post)=>(
                        <PostDetails key={post._id} post={post}/>

                    ))}
            </div>
        </div>
    )
}
export default Nav(Post);