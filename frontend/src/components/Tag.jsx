import { useState } from 'react';


function Tag() {
    const [tags, setTags] = useState([]);
    const inputId = "tagInput"; // Define a constant for input id

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                setTags([...tags, value]);
                e.target.value = '';
            }
        }
    }

    function removeTag(index) {
        setTags(tags.filter((_, i) => i !== index));
    }

    return (
        <div>
            <div className="flex flex-wrap">
                {tags.map((tag, index) => (
                <div className="flex items-center mb-5 mr-5" key={index}>
                     <span className="bg-yellow-200 rounded-lg px-2 mr-1">{tag}</span>
                     <span className="bg-red-500 rounded-full p-2 text-white w-4 h-4 ml-0 flex items-center justify-center cursor-pointer" onClick={() => removeTag(index)}>&times;</span>
                </div>
             ))}
 
         </div>
                <div>
                  <label className = "bg-primary text-white rounded-md px-2 py-1 mr-2" htmlFor={inputId}>Add a Tag: </label>
                  <input id={inputId} onKeyDown={handleKeyDown} type="text" className="rounded-md px-2" placeholder= "Type something" />
               </div>
        </div>
  
     );
}

export default Tag;
<<<<<<< HEAD

=======
>>>>>>> edit_post_etc

