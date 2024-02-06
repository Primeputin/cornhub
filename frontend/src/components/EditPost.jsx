import { Nav } from '../hocs'
import EditPostForm from './EditPostForm';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SinglePost = () => {

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const params = useParams();
    useEffect(()=>{
        const fetchPost = async()=>{
            try{
                const response = await fetch(`http://localhost:3000/api/posts/${params.id}`);
                if (response.ok)
                {
                    const json = await response.json();
                    setPost(json);
                }
            }
            catch (error)
            {
                console.error("Error fetching post:", error);
            }
            finally {
                setLoading(false); // Set loading to false regardless of success or error
             }
        }
        
        fetchPost();
    }, [])

    return (
        <>
            <div className='bg-secondary h-screen w-screen pt-28'>
                <div className='flex flex-col items-center justify-center bg-secondary'>
                    {loading ? (
                        <p>Loading...</p>
                        ) : post ? (
                        <EditPostForm post={post} />
                        ) : (
                        <p>No post found</p>
                        )}
                </div>

            </div>
            

        </>
        
    )
}

export default Nav(SinglePost);