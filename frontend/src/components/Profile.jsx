import { useState, useEffect, useContext } from 'react'
import { Nav } from '../hocs'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hocs';
import axios from 'axios';

const Profile = ({userProp}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(userProp);
    const [descBody, setDescBody] = useState('description');

    const { userId } = useContext(AuthContext);


    useEffect(() => {
        
        
        const fetchUser = async()=>{
            const response = await fetch("http://localhost:3000/api/users/" + userId);
            if (response.ok)
            {
                const json = await response.json();
                setUser(json);
                setDescBody(json.desc);
            }
        }

        fetchUser();
        
    
    }, []);

    const updateDesc = async ()=>{

        try {
            // update the description of the user
            const response = await axios.patch('http://localhost:3000/api/users/' + userId, { ...user, desc: descBody });
            setUser(response.data);


        } catch (error) {
            console.error('Error in editing a comment', error);
        }


    }

    return (
        <div className='bg-secondary h-screen w-screen flex flex-col justify-center items-center'>
            <div className='flex items-center justify-center bg-secondary flex-wrap'>
                <div className='flex flex-col items-center justify-center'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                        className="rounded-full cursor-pointer"
                        width="150" height = "150"
                        />
                    <span className='my-3 font-bold'>{user ? user.username: "username"}</span>
                    <button onClick={()=>{navigate('/EditProfPic/' + userId)}} className='bg-primary text-white rounded-md px-2'>Change image</button>
                </div>
                
                <div className='p-5 mx-9 bg-primary rounded-md w-1/2c'>
                   
                        <textarea onChange={(event)=>{setDescBody(event.target.value)}} name="desc" className='w-full bg-tertiary p-2 resize-none rounded-md' value={descBody}>
                        </textarea>
                        <br/>
                        <input onClick={()=>{updateDesc()}} className="bg-secondary rounded-md px-2" type="submit" value="Save"/>
                    
                </div>
            </div>

            <button className='bg-rose-500 text-white rounded-md px-2 mt-5'>Delete user</button>
        </div>
        
    )
}

export default Nav(Profile);