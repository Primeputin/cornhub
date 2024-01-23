import Nav from './Nav'

const Post = () => {

    return (
        <>
            <Nav />
            <div className='flex items-center justify-center bg-secondary h-screen w-screen'>
                <div className='flex items-center justify-center bg-secondary h-screen w-screen'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                            className="rounded-full cursor-pointer"
                            width="150" height = "150"
                            />
                        <span>Username</span>
                    </div>
                    
                    <div className='p-5 mx-9 bg-tertiary rounded-md'>
                            My description
                    </div>
            </div>
            </div>

            
        </>
    )
}
export default Post;