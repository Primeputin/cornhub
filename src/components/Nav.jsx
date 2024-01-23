import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


const Nav = () => {

    const [toggle, setToggle] = useState(false);
    const toggledRef = useRef(null);
    useEffect(()=>{
        const handleClickOutside = (event) => {
            if (toggledRef.current && !toggledRef.current.contains(event.target)) {
              // Clicked outside the div, hide it
              setToggle(false);
            }
        };
        
    
        document.addEventListener('click', handleClickOutside);
    
        
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    

    const navigate = useNavigate();


    return (
        <div className="w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-primary backdrop-blur-md">
            <div className='flex'>
                <h2 onClick={()=>navigate("/Home")} className="text-tertiary hover:text-white font-medium cursor-pointer px-2 mx-2">Home</h2>
                <h2 onClick={()=>navigate("/About")} className="text-tertiary hover:text-white font-medium cursor-pointer px-2 mx-2">About</h2>
            </div>

            <div className="px-2 mr-16">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                className="rounded-full cursor-pointer"
                onClick = {() => setToggle((prevToggle) => !prevToggle)}
                width="50" height = "50"
                ref={toggledRef}
                />

                <div 
                className={`${!toggle ? "hidden": "flex"} flex-col p-6 bg-primary absolute top-20 right-0 mx-8 my-2 rounded-xl text-tertiary`}>
                      <ul>

                        <li onClick={()=>navigate("/Profile")} className='hover:text-white'>
                            Edit Profile
                        </li>
                        <li onClick={()=>navigate("/Post")} className='hover:text-white'>
                            My Posts
                        </li>
                      </ul>
                </div>

                
            </div>
        </div>
    )
}

export default Nav;