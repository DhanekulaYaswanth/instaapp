import React, { useEffect, useState } from "react";
import './Post.css';
import axios from "axios";
import 'cropperjs/dist/cropper.min.css';

function Post(props){
    const [image, setImage] = useState('');
    const {usertoken} = props
    const [loading,setloading] = useState(false)
    const [posted, setposted] = useState(false) 
    const [imageurl,setimageurl] = useState('')

    const handleFileChange = (e) => {
        setposted(false)
        const file = e.target.files[0];
        setImage('')
    
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
    
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Set canvas dimensions to Instagram's post feed size
            canvas.width = 1080;
            canvas.height = 1080;
    
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
            // Get cropped image as a Blob
            canvas.toBlob((blob) => {
              const croppedImageFile = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
              setImage(croppedImageFile); // Set the cropped image file to the 'image' state
              handlePost1(croppedImageFile);
            }, 'image/jpeg', 0.8); // Adjust quality if needed
          };
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };


      const handlePost1 = async (file) => {
        console.log('here uploading image')
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'zjp16bzj'); // Replace with your Cloudinary upload preset
    
            // Upload cropped image directly to Cloudinary
            const response = await axios.post(
              'https://api.cloudinary.com/v1_1/dfjulowfc/image/upload',
              formData
            );
    
            // Handle the Cloudinary response here (e.g., show success message)
            setimageurl(response.data.secure_url)
            
    
            // Additional actions after successful upload
    
          } catch (error) {
            console.error('Error uploading image:', error);
            // Handle error (e.g., show error message)
          }
        
      };


      useEffect(()=>{
        if(posted){
            setTimeout(()=>{
                setposted(false)
            },3000)
        }
      },[posted])

      

    const handlePost = async(e)=>{
        e.preventDefault();
        setloading(true)
        const Title = document.getElementById('Title').value || ''
        const formData= {'image':imageurl,
                    'textData': Title,
                    'token': JSON.stringify(usertoken)}
        await axios.post('https://instaapp-lac.vercel.app/posttoinsta', formData)
        .then((res)=>{
            setloading(false)
            setposted(true)
            setImage('')
            document.getElementById('Title').value='';
        })
        .catch((err)=>{
            setloading(false)
            console.log(err)
            setposted(false);
        })
    } 


 
    return(
        <div className="postcontainer">
            
            <div className="wrapper">
                <img src={require('./red-heart-speech-bubble-png.webp')} alt="" className="likebtn"/>
                <div className="image">
                    <label htmlFor="select" className={image?"selected":'selection'}  style={{cursor:usertoken!==null?'pointer':'not-allowed'}}>{image?'':'Click Here to Select an image'}</label>
                    {image?
                        <>
                            <div style={{backgroundImage:`url(${URL.createObjectURL(image)})`, backdropFilter:"blur(5px)"}}>
                            </div>
                            <img src={URL.createObjectURL(image)} alt="error in file preview"></img>
                        </>
                        :
                        ''
                    }   
                </div>
                <form className="imageform" onSubmit={handlePost}>
                    <input type="file" accept="image/*" required onChange={handleFileChange} id="select" disabled={usertoken===null}/>
                    <input type="text" placeholder="Type here..." className="textbox" id='Title'/>
                    <input type="submit" id="submit" disabled={usertoken===null}/>
                </form>
            </div>
            {
                loading?
                    <label className="outerloader"><label className="innerloader"></label></label>
                :
                <label htmlFor="submit" className="postbtn" style={{cursor:usertoken?'pointer':'not-allowed'}}>{posted?<>Posted &#10003; </>:'Post MyFav Pic'}</label>

            }
        </div>
    )
}

export default Post;