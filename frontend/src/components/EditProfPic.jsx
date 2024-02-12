import { useCallback, useState, useRef } from 'react';
import { Nav } from '../hocs';
import { useDropzone } from 'react-dropzone';

const EditProfPic = ()=>{
    const [uploadedFile, setUploadedFile] = useState([]);

    const dropZoneDialog = useRef(null);

    const submitImage = (event)=>{
        event.preventDefault();

        const formData = new FormData();
        formData.append("image". uploadedFile);

        // this function should be used for onSubmit in the form tag
        // there are more things to be added here in the future 

    }
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
       
        // check if there is any accepted files
        if (acceptedFiles?.length) {
            const file = acceptedFiles[0]; // Get the first accepted file
            const uniqueFileName = `${file.name}-${Date.now()}`; // Create a unique name
            setUploadedFile({
                ...file,
                preview: URL.createObjectURL(file),
                uniqueName: uniqueFileName // Add a unique name property
            });
            
        }

        // Handle rejected files
        if (rejectedFiles?.length) {
            if (dropZoneDialog.current) {
                dropZoneDialog.current.innerText = `${rejectedFiles[0].errors[0].code}`;
            }
        }

        
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            maxFiles: 1,
            accept:{
                'image/*' : [] // accept any kind of image
            }
    });

    
    return (
        <div className='bg-secondary h-screen w-screen'>
                <div className='bg-secondary h-max w-screen p-28 flex flex-col'>
                    <form>
                
                        <div>
                            <label htmlFor="file">Upload new profile picture:</label>
                            {/* Use getRootProps to get the root props for the dropzone */}
                            <div {...getRootProps()} className='border-dashed p-16 cursor-pointer border-slate-950 border-2 mt-2'>
                                {/* Use getInputProps to get the input props for the file input */}
                                <input {...getInputProps()} type="file" name = "file"accept="image/*"/>
                                {/* Display a message or component based on drag-and-drop status */}
                                {/* {isDragActive ? (<p>Drop the files here</p>):
                                     (<p>Drag 'n' drop some files here, or click to select files</p>)
                                 } */}
                                 {isDragActive ? (
                                <p>Drop the file here</p>
                                    ) : (
                                        uploadedFile ? (
                                            <img src={uploadedFile.preview} alt="Dropped File" />
                                        ) : (
                                            <p>Drag 'n' drop a file here, or click to select a file</p>
                                        )
                                    )}
                                
                            </div>
                        </div>

                        <button type="submit" className='bg-tertiary my-2 mr-8'>Submit</button>                       
                        <span ref={dropZoneDialog} className='text-rose-500'></span>
                    </form>
                  
                </div>
        </div>
        
    )
}

export default Nav(EditProfPic);