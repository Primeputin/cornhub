import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import corn from '../assets/corn.png';
import menubar from '../assets/menubar.png';
import xicon from '../assets/x.png';
import { AuthContext } from '../hocs';

const Nav = (Component) => {
    return function hoc(){
        const [toggle, setToggle] = useState(false);
        const sideRef = useRef(null);

        const [toLog, setToLog] = useState(false);
        const dialogRef = useRef(null);

        const [menuBar, setMenuBar] = useState(false);
        const menuBarRef = useRef(null);

        const { isLoggedIn, logout, userId } = useContext(AuthContext);

        const [user, setUser] = useState(null);

        const [searchText, setSearchText] = useState("");
        const apiUrl = import.meta.env.VITE_API_URL;


        useEffect(() => {
        
        
            const fetchUser = async()=>{
                const response = await fetch(apiUrl+ "/api/users/" + userId);
                if (response.ok)
                {
                    const json = await response.json();
                    setUser(json);
                }
            }
            if (isLoggedIn)
            {
                fetchUser();
            }
        
        }, [userId]); // needed when authcontext sets this up

        useEffect(()=>{
            const handleClickOutside = (event) => {
                if (sideRef.current && !sideRef.current.contains(event.target)) {
                // Clicked outside the div, hide the side panel
                setToggle(false);
                }
            };
            
        
            document.addEventListener('click', handleClickOutside);
        
            
            return () => {
            document.removeEventListener('click', handleClickOutside);
            };
        }, []);

        useEffect(()=>{
            const handleClickOutside = (event) => {
                if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
                // Clicked outside the div, hide the menu bar
                setMenuBar(false);
                }
            };
            
        
            document.addEventListener('click', handleClickOutside);
        
            
            return () => {
            document.removeEventListener('click', handleClickOutside);
            };
        }, []);

        useEffect(() => {
            const handleResize = () => {
              // Update state based on screen width
              if (window.innerWidth <= 768)
              {
                setMenuBar(false);
              }
            };
        

            handleResize();
        
            window.addEventListener('resize', handleResize);
        
            
            return () => window.removeEventListener('resize', handleResize);
          }, []); 

        useEffect(()=>{
            const outsideDialog = (event) => {
                const isButtonClick = event.target.tagName.toLowerCase() === 'button';
                // button checking is added because it immediately closes when the condition is not added
                if (dialogRef.current && !dialogRef.current.contains(event.target) && dialogRef.current.classList.contains('flex') && !isButtonClick) {
                    
                    // Clicked outside the div, hide the dialog
                    setToLog(false);
                    // Nullify the onClick action
                    event.preventDefault();
                }
            };
            
        
            document.addEventListener('click', outsideDialog);
        
            
            return () => {
            document.removeEventListener('click', outsideDialog);
            };
        }, []);
        

        const navigate = useNavigate();
        

        function navformat(searchText){
            let searchArr = new Array;
            for(let i = 0; i< searchText.length; i++){//format to account for spaces
                if(searchText[i]==" "){
                    searchArr.push("_");
                }else{
                    searchArr.push(searchText[i]);
                }
            }
           
            if(searchText.length > 0){
                navigate("/Search/"+ searchArr.join(""))//only searches if the search box has text
            }

            else{
                navigate("/Home")
            }
            
        }
        
        function handleKeyDown(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                    navformat(value);
                    e.target.value = '';
                }
            }
        }

        return (
            <>
            
                <div className={`${!toLog ? 'opacity-100' : 'opacity-50'} w-full flex items-center justify-between py-5 fixed top-0 z-20 bg-primary backdrop-blur-md`}>
                    <div className='md:flex hidden'>
                        <h2 onClick={()=>navigate("/Home")} className="text-tertiary hover:text-white font-medium cursor-pointer px-2 mx-2">Home</h2>
                        <h2 onClick={()=>navigate("/Popular")} className="text-tertiary hover:text-white font-medium cursor-pointer px-2 mx-2">Popular</h2>
                        <h2 onClick={()=>navigate("/About")} className="text-tertiary hover:text-white font-medium cursor-pointer px-2 mx-2">About</h2>
                    </div>

                    <div ref={menuBarRef} onClick = {() => setMenuBar((prevToggle) => !prevToggle)} className='md:hidden flex'>
                        <div className='px-2 mx-2'>
                            <img src={menuBar ? xicon : menubar} className='size-8'/>
                        </div>

                    </div>
                    {/* extra menu bar */}
                    <div 
                        className={`${!menuBar ? "hidden opacity-0": "flex opacity-100"} transition ease-out delay-150 duration-150 flex-col p-6 bg-primary absolute top-20 right-100 mx-8 my-2 rounded-xl text-tertiary drop-shadow-2xl`}>
                            <ul>

                                <li onClick={()=>navigate("/Home")} className='hover:text-white cursor-pointer '>
                                    Home
                                </li>
                                <li onClick={()=>navigate("/Popular")} className='hover:text-white cursor-pointer'>
                                    Popular
                                </li>
                                <li onClick={()=>navigate("/About")} className='hover:text-white cursor-pointer'>
                                    About
                                </li>
                            </ul>
                        </div>

                    <div>
                        <form className='bg-white rounded-lg'>
                            <input className="rounded-lg sm:rounded-lg sm:rounded-r-none px-2"
                            onKeyDown={handleKeyDown} onChange={(event)=>{setSearchText(event.target.value)}} type="text" name="search" placeholder="Search.." defaultValue={searchText}/>
                            <input className="hidden md:inline rounded-r-lg px-2 ml-[3px] ml-[1px] bg-zinc-200 hover:bg-zinc-300 bg-search-icon bg-cover bg-center bg-sm"
                            onClick={()=>navformat(searchText)}type="button" name="search" value = "  "/>
                        </form>
                    </div>

                    <div className="flex items-center justify-center px-2 mr-16">
                        {!isLoggedIn && (
                            <button onClick={() => setToLog((prevToggle) => !prevToggle)} className="bg-primary text-center px-4 py-2 text-white font-bold rounded-lg mx-2">
                                Login
                            </button>
                        )}
                        {isLoggedIn && (
                            <button onClick={()=>navigate("/CreatePost")} className="bg-primary text-center px-4 py-2 text-white font-bold rounded-lg mx-2">
                                +
                            </button>
                        )}
                        
                        <img src={userId && user && user.profpic ? apiUrl + "/api/uploads/actual/" + user.profpic.filename :"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                        className="rounded-full cursor-pointer p-1 mx-1 max-w-sm max-h-sm w-14 h-14"
                        onClick = {() => {
                            if (isLoggedIn)
                            {
                                setToggle((prevToggle) => !prevToggle);
                            }
                        }}
                        // width="50" height = "50"
                        ref={sideRef}
                        />


                        {/* side panel */}
                        <div 
                        className={`${!toggle ? "hidden opacity-0": "flex opacity-100"} transition ease-out delay-150 duration-150 flex-col p-6 bg-primary absolute top-20 right-0 mx-8 my-2 rounded-xl text-tertiary drop-shadow-2xl`}>
                            <ul>

                                <li onClick={()=>navigate("/Profile")} className='hover:text-white cursor-pointer '>
                                    Edit Profile
                                </li>
                                <li onClick={()=>navigate("/Post/" + userId)} className='hover:text-white cursor-pointer'>
                                    My Posts
                                </li>
                                <li onClick={()=>{
                                    logout();
                                    navigate("/");
                                }} className='hover:text-white cursor-pointer'>
                                    Logout
                                </li>
                            </ul>
                        </div>

                        
                    </div>
                </div>

                <dialog ref={dialogRef} className={`${!toLog ? "hidden": "flex"} fixed top-1/4 flex-col items-center justify-center bg-lime-50 p-10 z-50 rounded-lg shadow-lg shadow-gray-700`}>
                        <div>
                            <img src={corn} className="mx-auto size-32 hover:drop-shadow-yellow" alt="Corn logo" />
                        </div>
                        <h2 className='text-center'>Welcome to Corn Hub 🌽</h2>
                        <div className="flex gap-x-8 mt-4">
                            <button onClick={()=>navigate("/Register")}>Register</button>
                            <button onClick={()=>navigate("/Login")}>Login</button>
                        </div>
                </dialog>

                <div className={`${!toLog ? 'opacity-100' : 'opacity-50'}`}>
                        
                        <Component />
                        
                    
                </div>
                
            </>
        );
    }
}

export default Nav;