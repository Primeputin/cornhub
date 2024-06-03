import { useNavigate } from 'react-router-dom';
import corn from '../assets/corn.png'
import { AuthContext } from '../hocs';
import { useEffect, useContext } from 'react';
import ParticlesComp from './Particles'

const Begin = () =>{
    const navigate = useNavigate();
    const { isLoggedIn, userId } = useContext(AuthContext);

    function toRegister()
    {
        navigate("/Register");
    }

    function toLogin()
    {
        navigate("/Login");
    }

    useEffect(()=>{
        if (isLoggedIn) {
            navigate("/Home");  
        }
    }, [isLoggedIn])
    
    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen bg-lime-50'>
        <ParticlesComp className='h-full w-full -z-10' id="Register"/>
          <div >
              <img src={corn} className="mx-auto size-64 hover:drop-shadow-yellow" alt="Corn logo" />
          </div>
          <h1 className='text-center'>Welcome to Kernel Hub 🌽</h1>
          <div className="flex gap-x-8 mt-4">
              <button onClick = {toRegister}>Register</button>
              <button onClick = {toLogin}>Login</button>
          </div>
        </div>
        
      )

}

export default Begin;