import Nav from '../hocs/Nav';
import ParticlesComp from './Particles'
const About = () =>{

    return (
        <>
            <ParticlesComp className='h-full w-full -z-10' id="About"/>
            <div className='flex flex-col bg-secondary h-screen w-screen p-10'>
                <h1 className='mt-20 mb-8 font-bold'>Kernel Hub</h1>
                <h2 className='font-bold'>NPM Packages & Third party Library used</h2>
                <p className='mx-5'>Vite</p>
                <p className='mx-5'>Tailwind</p>
                <h3 className='mx-5 font-bold'>Nodejs third-parties:</h3>
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
                        multer
                    </li>
                    <li>
                        mongoose
                    </li>
                    <li>
                        express-session
                    </li>
                    <li>
                        connect-mongodb-session
                    </li>
                    <li>
                        bcrypt
                    </li>
                </ul>
                <h3 className='mx-5 font-bold'>React Libraries:</h3>
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
                    <li>
                        @tsparticles/react
                        @tsparticles/slim
                    </li>
                </ul>
                <h3 className='mx-5 font-bold'>Vite plugins:</h3>
                <ul className='items-start mx-8'>
                    <li>
                        @rollup/plugin-replace
                    </li>
                  
                </ul>


                <h3 className='mx-5 font-bold'>Contributors:</h3>
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