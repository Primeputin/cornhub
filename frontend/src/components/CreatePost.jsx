import { useCallback, useState, useRef } from 'react';
import { Nav } from '../hocs';
import { useDropzone } from 'react-dropzone';

const CreatePost = ()=>{
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
                        <div>
                            <label htmlFor="file">Upload Files:</label>
                            {/* Use getRootProps to get the root props for the dropzone */}
                            <div {...getRootProps()} className='border-dashed p-16 cursor-pointer border-slate-950 border-2 mt-2'>
                                {/* Use getInputProps to get the input props for the file input */}
                                <input {...getInputProps()} type="file" accept="image/*"/>
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