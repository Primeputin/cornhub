import { Nav } from '../hocs'
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const navigate = useNavigate();

    return (
        <div className='bg-secondary h-screen w-screen flex flex-col justify-center items-center'>
            <div className='flex items-center justify-center bg-secondary flex-wrap'>
                <div className='flex flex-col items-center justify-center'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                        className="rounded-full cursor-pointer"
                        width="150" height = "150"
                        />
                    <span className='my-3 font-bold'>Username</span>
                    {/* temporary user id that is harcoded */}
                    <button onClick={()=>{navigate('/EditProfPic/' + '123')}} className='bg-primary text-white rounded-md px-2'>Change image</button>
                </div>
                
                <div className='p-5 mx-9 bg-primary rounded-md w-1/2c'>
                     <form action="">
                        <textarea name="desc" className='w-full bg-tertiary p-2 resize-none rounded-md' defaultValue="My description">
                        </textarea>
                        <br/>
                        <input className="bg-secondary rounded-md px-2" type="submit" value="Submit"/>
                    </form>
                </div>
            </div>

            <button className='bg-rose-500 text-white rounded-md px-2 mt-5'>Delete user</button>
        </div>
        
    )
}

export default Nav(Profile);