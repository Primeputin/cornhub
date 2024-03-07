import { Nav } from '../hocs'
import PostDetails from './PostDetails';
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../hocs';
import { json, useParams } from "react-router-dom";

const SearchResults = () => {

    const [posts, setPosts] = useState(null);
    const { userId } = useContext(AuthContext);
    const params = useParams();

    useEffect(()=>{
        const fetchPosts = async()=>{
            const response = await fetch("http://localhost:3000/api/posts/search/"+ params.SearchText); // it will forward/ proxy this to localhost:3000 which is the nodejs server defined in the package.json
            if (response.ok)
            {
                const json = await response.json();
                setPosts(json);
            }
        }

        fetchPosts();

    }, [params.SearchText])

    return (
        <>
            <div className='bg-secondary h-screen w-screen pt-28'>
                <div className='flex flex-col items-center justify-center bg-secondary'>
                    {posts && posts.length > 0 ? (userId ? posts : posts.slice(0, 16)).map((post)=>(
                        <PostDetails key={post._id} userId={userId} post={post}/>
                    )): <h3>No posts match search.</h3>}
                
                </div>
            </div>
            

        </>
        
    )
}

export default Nav(SearchResults);