import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate("/Home");
    };

    return (
        <div className='flex flex-col items-center justify-center w-screen h-screen gap-y-8 bg-lime-50'>
          <h1 className='text-center'>Login to your 🌽ny account!</h1>
          <form className="flex flex-col items-center justify-center gap-y-3">
                <input type="text" placeholder="username" className="border border-primary rounded-md"/>
                <input type="password" placeholder="password" className="border border-primary rounded-md"/>
                <div>
                    <input
                        type="checkbox"
                        value="Remember me"
                    />
                    <label className='text-xs ml-2'>Remember me</label>
                </div>
                
          </form>
          <div className="flex gap-x-8 mt-4">
              <button onClick={handleLogin}>Login</button>
              
          </div>
        </div>
    )
   
}

export default Login;