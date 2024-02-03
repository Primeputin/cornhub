import { useNavigate } from 'react-router-dom';
import corn from '../assets/corn.png'


const Begin = () =>{
    const navigate = useNavigate();

    function toRegister()
    {
        navigate("/Register");
    }

    function toLogin()
    {
        navigate("/Login");
    }
    
    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen bg-lime-50'>
          <div >
              <img src={corn} className="mx-auto size-64 hover:drop-shadow-yellow" alt="Corn logo" />
          </div>
          <h1 className='text-center'>Welcome to Corn Hub 🌽</h1>
          <div className="flex gap-x-8 mt-4">
              <button onClick = {toRegister}>Register</button>
              <button onClick = {toLogin}>Login</button>
          </div>
        </div>
        
      )

}

export default Begin;