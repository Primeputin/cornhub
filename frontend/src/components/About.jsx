import Nav from '../hocs/Nav';

const About = () =>{

    return (
        <>
            <div className='flex flex-col bg-secondary h-screen w-screen'>
                <h1 className='mt-36 mb-8'>Corn Hub</h1>
                <h2>NPM Packages & Third party Library used</h2>
                <p className='mx-5'>Vite</p>
                <p className='mx-5'>Tailwind</p>
                <h3 className='mx-5'>Nodejs third-parties:</h3>
                <ul className='items-start mx-8'>
                    <li>
                        cors
                    </li>
                    <li>
                        dotenv
                    </li>
                    <li>
                        express
                    </li>
                    <li>
                        mongoose
                    </li>
                </ul>
                <h3 className='mx-5'>React Libraries:</h3>
                <ul className='items-start mx-8'>
                    <li>
                        react-dom
                    </li>
                    <li>
                        react-router-dom
                    </li>
                    <li>
                        react-dropzone
                    </li>
                </ul>

                <h3 className='mx-5'>Contributors:</h3>
                <ul className='items-start mx-8'>
                    <li>
                        Dave Aldwin Bolima
                    </li>
                    <li>
                        Andrei Zachary P. Lim
                    </li>
                    <li>
                        Pierce Zachary C. Hokia
                    </li>
                    <li>
                        Vladimir Casey L. Tang
                    </li>
                </ul>

            </div>

        </>
        
    )
}

export default Nav(About);