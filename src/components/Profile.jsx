import Nav from './Nav'

const Profile = () => {

    return (
        <>
            <Nav />
            <div className='flex items-center justify-center bg-secondary h-screen w-screen'>
                <div className='flex flex-col items-center justify-center'>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                        className="rounded-full cursor-pointer"
                        width="150" height = "150"
                        />
                    <span>Username</span>
                </div>
                
                <div className='p-5 mx-9 bg-primary rounded-md'>
                     <form action="">
                        <textarea name="desc" rows="4" cols="50" className='bg-tertiary p-2 resize-none rounded-md'>
                            My description
                        </textarea>
                        <br/>
                        <input className="bg-secondary rounded-md px-2" type="submit" value="Submit"/>
                    </form>
                </div>
            </div>


        </>
        
    )
}

export default Profile;