import { useCallback, useState, useRef } from 'react';
import { Nav } from '../hocs';
import { useDropzone } from 'react-dropzone';

const CreatePost = ()=>{

    // for tags
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

    // for uploading images
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const dropZoneDialog = useRef(null);

    const removeFile = (uniqueName)=>{
        setUploadedFiles(uploadedFiles => uploadedFiles.filter(file => uniqueName !== file.uniqueName))
    }

    const submitImage = (event)=>{
        event.preventDefault();

        const formData = new FormData();
        formData.append("image". uploadedFiles);

        // this function should be used for onSubmit in the form tag
        // there are more things to be added here in the future 

    }
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // check if there is any accepted files
        if (acceptedFiles?.length) {
            // Handle the dropped files, for example, add them to the state
            setUploadedFiles((prevFiles) => [
              ...prevFiles,
              ...acceptedFiles.map((file) => {
                const uniqueFileName = `${file.name}-${Date.now()}`;
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
            accept:{
                'image/*' : [] // accept any kind of image
            }
    });

    
    return (
        <div className='bg-secondary h-screen w-screen'>
                <div className='bg-secondary h-max w-screen p-28 flex flex-col'>
                    <form>
                        <input type="text" name="title" className='rounded-lg px-2 text-2xl font-bold my-2 w-full' placeholder='Add a Title'/>
                        
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

                        <textarea name="desc" className='p-2 mt-5 mb-3 rounded-md w-full h-36 overflow-y-auto resize-none' >Add some Details</textarea>
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