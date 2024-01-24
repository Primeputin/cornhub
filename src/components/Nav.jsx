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

            <div>
                 <form className='bg-white rounded-lg'>
                    <input className="rounded-lg sm:rounded-lg sm:rounded-r-none px-2"
                    type="text" name="search" placeholder="Search.."/>
                    <input className="hidden sm:inline rounded-r-lg px-2 ml-[3px] ml-[1px] bg-zinc-200 hover:bg-zinc-300 bg-search-icon bg-cover bg-center bg-sm"
                    type="button" name="search" value = "  "/>
                </form>
            </div>

            <div className="flex items-center justify-center px-2 mr-16">
                <button className="bg-primary text-center px-4 py-2 text-white font-bold rounded-lg mx-2">
                    +
                </button>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                className="rounded-full cursor-pointer p-1 mx-2"
                onClick = {() => setToggle((prevToggle) => !prevToggle)}
                width="50" height = "50"
                ref={toggledRef}
                />

                <div 
                className={`${!toggle ? "hidden": "flex"} flex-col p-6 bg-primary absolute top-20 right-0 mx-8 my-2 rounded-xl text-tertiary drop-shadow-2xl`}>
                      <ul>

                        <li onClick={()=>navigate("/Profile")} className='hover:text-white cursor-pointer '>
                            Edit Profile
                        </li>
                        <li onClick={()=>navigate("/Post")} className='hover:text-white cursor-pointer'>
                            My Posts
                        </li>
                        <li onClick={()=>navigate("/")} className='hover:text-white cursor-pointer'>
                            Logout
                        </li>
                      </ul>
                </div>

                
            </div>
        </div>
    )
}

export default Nav;