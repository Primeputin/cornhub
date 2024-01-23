import Nav from './Nav'

const Home = () => {

    return (
        <>
            <Nav />
            <div className='flex items-center justify-center bg-secondary h-screen w-screen'>
                
                <button className="m-[10px] fixed bottom-0 z-20 bg-primary text-center px-4 py-2 text-white rounded-lg">
                    +
                </button>
            </div>

        </>
        
    )
}

export default Home;