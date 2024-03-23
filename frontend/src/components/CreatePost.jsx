import { useCallback, useState, useRef, useContext } from 'react';
import { Nav } from '../hocs';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../hocs';


const CreatePost = ()=>{

    const navigate = useNavigate();

    const { userId } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [desc, setDescBody] = useState('');

    // for tags
    const [tags, setTags] = useState([]);
    const inputId = "tagInput"; // Define a constant for input id
    const apiUrl = import.meta.env.VITE_API_URL;

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

    // for uploading images
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const dropZoneDialog = useRef(null);

    const removeFile = (uniqueName)=>{
        setUploadedFiles(uploadedFiles => uploadedFiles.filter(file => uniqueName !== file.uniqueName))
    }

    const onSubmit = async (event)=>{
        event.preventDefault();

        const formData = new FormData();
        let success = false;

        
        uploadedFiles.forEach((file) => {
            // Append a unique name
            formData.append("images", file); // note: same multiple image will be processed as one image by multer in the backend
        });


        try {
            let uploadedImages = []
            if (formData.has("images")) // formData.length doesn't work. It doesn't represent the number of files
            {
                const response = await axios.post(apiUrl + '/api/uploads/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                });
                uploadedImages = response.data.uploadedImages; 
                console.log('Uploaded images:');
                
            }
            

            const newPost = {
                user: userId,
                title: title,
                desc: desc,
                tags: tags,
                likes: 0,
                dislikes: 0,
                postedImages: uploadedImages.map(image => image._id),
            }

            const post = await axios.post(apiUrl +'/api/posts/', newPost);


            success = true;
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            // clear formData
            formData.delete("images");
        }
        if (success)
        {
            navigate("/Home");
        }

    }
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // check if there is any accepted files
        if (acceptedFiles?.length) {
            // Handle the dropped files, for example, add them to the state
            setUploadedFiles((prevFiles) => [
              ...prevFiles,
              ...acceptedFiles.map((file) => {

                const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
                const fileExtension = file.name.split('.').pop();
                const uniqueFileName = `${fileNameWithoutExtension}-${Date.now()}.${fileExtension}`;

                return Object.assign(file, {
                  preview: URL.createObjectURL(file),
                  uniqueName: uniqueFileName, // Add a property to store the unique name
                });
              }),
            ]);
          }

        // Handle rejected files
        if (rejectedFiles?.length) {
            if (dropZoneDialog.current)
            {
                dropZoneDialog.current.innerText = `${rejectedFiles[0].errors[0].code}`;
            }

            // Remove rejected files from the state
            setUploadedFiles((prevFiles) =>
                prevFiles.filter((file) => !rejectedFiles.includes(file))
            );
        }
        
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop,
            maxFiles: 5,
            accept:{
                'image/*' : [], // accept any kind of image
            },
            disabled: uploadedFiles.length >= 5, // Disable dropzone when file limit is reached
    });

    
    return (
        <div className='bg-secondary h-screen w-screen'>
                <div className='bg-secondary h-max w-screen p-28 flex flex-col'>
                    <form onSubmit={onSubmit} method="post">
                        <input required onChange={(event)=>{setTitle(event.target.value)}} type="text" name="title" className='rounded-lg px-2 text-2xl font-bold my-2 w-full' placeholder='Add a Title'/>
                        
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

                        <textarea required onChange={(event)=>{setDescBody(event.target.value)}} name="desc" className='p-2 mt-5 mb-3 rounded-md w-full h-36 overflow-y-auto resize-none' placeholder="Add some details"></textarea>
                        <div>
                            <label htmlFor="file">Upload Files:</label>
                            {/* Use getRootProps to get the root props for the dropzone */}
                            <div {...getRootProps()} className='border-dashed p-16 cursor-pointer border-slate-950 border-2 mt-2'>
                                {/* Use getInputProps to get the input props for the file input */}
                                <input {...getInputProps()} type="file" name = "file"accept="image/*"/>
                                {/* Display a message or component based on drag-and-drop status */}
                                {isDragActive ? (<p>Drop the files here</p>):(<p>Drag 'n' drop some files here, or click to select files</p>)}
                                
                            </div>
                        </div>

                        <button type="submit" className='bg-tertiary my-2 mr-8'>Submit</button>                       
                        <span ref={dropZoneDialog} className='text-rose-500'></span>
                    </form>
                    {/* Preview */}
                    <ul className='flex items-center flex-wrap h-max bg-secondary'>
                        {uploadedFiles.map(file=>(
                            <li key={file.uniqueName} className='text-gray-950 m-8'>
                                {/* revoke the object url to avoid memory leaks */}
                                <img src={file.preview} onLoad={()=>{URL.revokeObjectURL(file.preview)}} className='max-sm:h-10 max-sm:w-10 sm:h-16 sm:w-16 inline mr-8 shadow-lg shadow-gray-900'/> 
                                <button onClick={()=>removeFile(file.uniqueName)}  className="max-sm:font-xs max-sm:py-2 max-sm:px-2  px-5 bg-rose-500 text-white hover:shadow-lg hover:shadow-gray-900"> X </button>
                            </li>
                        ))}
                    
                    </ul>
                </div>
        </div>
        
    )
}

export default Nav(CreatePost);