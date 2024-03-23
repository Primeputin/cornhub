import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invalid, setInvalid] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;



    const registerUser = async ()=>{

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please retype your password.');
            setPassword('');
            setConfirmPassword('');
        } else {
            // new user object
            const newUser = {
                username: username,
                password: password,
            };
        
            try {
                // Send HTTP request to create a new user
                const response = await axios.post(apiUrl+'/api/users/', newUser);
        
                // go the beginning page
                navigate("/");
            } catch (error) {
                console.error('Error registering:', error);
                setInvalid(true);
            }
        }    
    }

    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen gap-y-8 bg-lime-50'>
          <h1 className='text-center'>Register your new 🌽ny account!</h1>
          <form className="flex flex-col items-center justify-center gap-y-3">
                <input onChange={(event)=>{setUsername(event.target.value)}} type="text" placeholder="username" className="border border-primary rounded-md"/>
                <input onChange={(event)=>{setPassword(event.target.value)}} type="password" placeholder="password" className="border border-primary rounded-md"/>
                <input onChange={(event)=>{setConfirmPassword(event.target.value)}} type="password" placeholder="re-type password" className="border border-primary rounded-md"/>
          </form>
          <div className="flex gap-x-8 mt-4">
              <button onClick={registerUser}>Register</button>
          </div>
          {invalid ? (<span className='text-rose-500'>Username already used</span>): (<div></div>)

          }
          
        </div>
    )
}



export default Register;