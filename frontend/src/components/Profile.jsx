import { Nav } from '../hocs'

const Profile = () => {

    return (
        <>
            <div className='flex items-center justify-center bg-secondary h-screen w-screen flex-wrap'>
                <div className='flex flex-col items-center justify-center'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                        className="rounded-full cursor-pointer p-5"
                        width="150" height = "150"
                        />
                    <span>Username</span>
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


        </>
        
    )
}

export default Nav(Profile);