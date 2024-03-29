import { useState, useEffect, useContext } from 'react'
import { Nav } from '../hocs'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hocs';
import axios from 'axios';

const Profile = ({userProp}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(userProp);
    const [descBody, setDescBody] = useState('description');

    const { userId, logout } = useContext(AuthContext);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        
        
        const fetchUser = async()=>{
            try
            {
                const response = await axios.get(apiUrl+"/api/users/" + userId);

                setUser(response.data);
                setDescBody(response.data.desc);
            }
            catch (error)
            {
                console.error('Error in fetching user data', error);
            }
            
                
            
        }

        fetchUser();
        
    
    }, []);

    const updateDesc = async ()=>{

        try {
            // update the description of the user
            const response = await axios.patch(apiUrl+'/api/users/' + userId, { ...user, desc: descBody });
            setUser(response.data);


        } catch (error) {
            console.error('Error in editing the description of the user', error);
        }


    }

    const deleteUser = async ()=>{
        try {
            const response = await axios.delete(apiUrl+'/api/users/' + userId);
            logout();
            navigate("/");
        } catch (error) {
            console.error('Error deleting current user', error);
        }
    }

    return (
        <div className='bg-secondary h-screen w-screen flex flex-col justify-center items-center'>
            <div className='flex items-center justify-center bg-secondary flex-wrap'>
                <div className='flex flex-col items-center justify-center'>
                    <img src={user && user.profpic ? apiUrl+"/api/uploads/actual/" + user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                        className="rounded-full cursor-pointer max-w-md max-h-md w-32 h-32"
                        />
                    <span className='my-3 font-bold'>{user ? user.username: "username"}</span>
                    <button onClick={()=>{navigate('/EditProfPic')}} className='bg-primary text-white rounded-md px-2'>Change image</button>
                </div>
                
                <div className='p-5 mx-9 bg-primary rounded-md w-1/2c'>
                   
                        <textarea onChange={(event)=>{setDescBody(event.target.value)}} name="desc" className='w-full bg-tertiary p-2 resize-none rounded-md' value={descBody}>
                        </textarea>
                        <br/>
                        <input onClick={()=>{updateDesc()}} className="bg-secondary rounded-md px-2 shadow hover:shadow-xl hover:text-primary" type="submit" value="Save"/>
                    
                </div>
            </div>

            <button onClick={deleteUser} className='bg-rose-500 text-white rounded-md px-2 mt-5'>Delete user</button>
        </div>
        
    )
}

export default Nav(Profile);