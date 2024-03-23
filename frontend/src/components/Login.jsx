import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hocs';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, login, userId } = useContext(AuthContext);

    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(()=>{
        if (isLoggedIn) {
            navigate("/Home/" + userId);  
        }
    }, [])
    

    const handleLogin = async () => {
        
        const user = {
            username: username,
            password: password,
        };
    
        try {
            // Send HTTP request to check users
            const response = await axios.post(apiUrl + '/api/users/check/', {...user, remember: remember});
            // set login state to true for context
            login(response.data._id); 
            // go the home page
            navigate("/Home");           
    
            
        } catch (error) {
            console.error('Error registering:', error);
            setInvalid(true);
        }
    
    };

    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen gap-y-8 bg-lime-50'>
          <h1 className='text-center'>Login to your 🌽ny account!</h1>
          <form className="flex flex-col items-center justify-center gap-y-3">
                <input onChange={(event)=>{setUsername(event.target.value)}} type="text" placeholder="username" className="border border-primary rounded-md"/>
                <input onChange={(event)=>{setPassword(event.target.value)}} type="password" placeholder="password" className="border border-primary rounded-md"/>
                <div>
                    <input
                        type="checkbox"
                        value="Remember me"
                        onClick = {()=>{setRemember(prev => !prev)}}
                    />
                    <label className='text-xs ml-2'>Remember me</label>
                </div>
                
          </form>
          <div className="flex gap-x-8 mt-4">
              <button onClick={handleLogin}>Login</button>
              
          </div>
          {invalid ? (<span className='text-rose-500'>Invalid!</span>): (<div></div>)}
        </div>
    )
   
}

export default Login;