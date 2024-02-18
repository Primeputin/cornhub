import { useCallback, useState, useRef, useContext } from 'react';
import { Nav } from '../hocs';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AuthContext } from '../hocs';

const EditProfPic = ()=>{
    const [uploadedFile, setUploadedFile] = useState(null); // for previewing images
    const [toBeUploadedFile, setToBeUploadedFile] = useState(null); // for getting the actual file
    const dropZoneDialog = useRef(null);

    const { userId } = useContext(AuthContext);

    const submitImage = async (event)=>{
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", toBeUploadedFile); // first parameter will say that the fieldname for this file is image
        try {
            const response = await axios.post('http://localhost:3000/api/uploads/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log('Image uploaded:', response.data.filename);
            const user = await axios.get("http://localhost:3000/api/users/" + userId);

            if (user.data.hasOwnProperty('profpic'))
            {
                await axios.delete('http://localhost:3000/api/uploads/' + user.data.profpic._id);
                console.log("Changed Image")
            }
            await axios.patch('http://localhost:3000/api/users/' + userId, {profpic: response.data._id});
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            // clear formData
            formData.delete("image");
        }

    }
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
       
        // check if there is any accepted files
        if (acceptedFiles?.length) {
            const file = acceptedFiles[0]; // Get the first accepted file
            setToBeUploadedFile(file);
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

                        <button onClick={submitImage} type="submit" className='bg-tertiary my-2 mr-8'>Submit</button>                       
                        <span ref={dropZoneDialog} className='text-rose-500'></span>
                    </form>
                  
                </div>
        </div>
        
    )
}

export default Nav(EditProfPic);