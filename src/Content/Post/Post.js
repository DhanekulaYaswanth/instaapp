import React, { useEffect, useState } from "react";
import './Post.css';
import axios from "axios";
import 'cropperjs/dist/cropper.min.css';

function Post(props){
    const [image, setImage] = useState('');
    const {usertoken} = props
    const [loading,setloading] = useState(false)
    const [posted, setposted] = useState(false) 

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
            }, 'image/jpeg', 0.8); // Adjust quality if needed
          };
        };
    
        if (file) {
          reader.readAsDataURL(file);
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
        const formData = new FormData();
        const Title = document.getElementById('Title').value || ''
        formData.append('image',image);
        formData.append('textData', Title);
        formData.append('token', JSON.stringify(usertoken));
        await axios.post('http://localhost:3030/posttoinsta', formData, { headers: {'Content-Type': 'multipart/form-data', }, })
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