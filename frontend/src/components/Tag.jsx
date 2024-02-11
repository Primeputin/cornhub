import React, { useState } from 'react';
import xIcon from'../assets/x.png'
// function Tag() {
//     const [tags, setTags] = useState([]);

//     function handleKeyDown(e) {
//         if (e.key === 'Enter') {
//             e.preventDefault(); // Prevent default behavior of Enter key
//             const value = e.target.value;
//             if (value.trim()) {
//                 setTags([...tags, value]);
//                 e.target.value = '';
//             }
//         }
//     }

//     function removeTag(index) {
//         setTags(tags.filter((_, i) => i !== index));
//     }

//     return (
//         <div className="tags-input-container">
//             {tags.map((tag, index) => (
//                 <div className="tag-item" key={index}>
//                     <span className="text">{tag}</span>
//                     <button onClick={()=>removeTag(index)} > x</button>
//                 </div>
//             ))}
//             <label htmlFor="tagInput">Add a Tag:</label>
//             <input id="tagInput" onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Type something" />
//         </div>
//     );
// }

// export default Tag;



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
                     <span className="bg-red-500 rounded-full p-2 text-white w-4 h-4 ml-0 flex items-center justify-center" onClick={() => removeTag(index)}>&times;</span>
                </div>
             ))}
 
         </div>
                <div>
                  <label  className = " bg-yellow-200 rounded-full px-2 py-1 mr-2" htmlFor={inputId}>Add a Tag</label>
                  <input id={inputId} onKeyDown={handleKeyDown} type="text" className="rounded-md" placeholder=" Type something" />
               </div>
        </div>
  
     );
}

export default Tag;
// function Tag() {
//     const [tags, setTags] = useState([]);
//     const inputId = "tagInput"; // Define a constant for input id

//     function handleKeyDown(e) {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             const value = e.target.value.trim();
//             if (value) {
//                 setTags([...tags, value]);
//                 e.target.value = '';
//             }
//         }
//     }

//     function removeTag(index) {
//         setTags(tags.filter((_, i) => i !== index));
//     }

//     return (
//         <div className="flex flex-wrap">
//             {tags.map((tag, index) => (
//                 <div className="flex items-center" key={index}>
//                     <span className="bg-yellow-200 rounded-lg px-2 mr-1">{tag}</span>
//                     <button className="bg-red-500 rounded-full p-2 text-white w-1 h-1 ml-1 flex items-center justify-center" onClick={() => removeTag(index)}>X</button>
//                 </div>
//             ))}
//             <label htmlFor={inputId}>Add a Tag:</label>
//             <input id={inputId} onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Type something" />
//         </div>
//     );
// }

// export default Tag;

