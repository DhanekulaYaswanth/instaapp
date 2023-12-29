
//exporting the necessary modules
const cloudinary = require('cloudinary').v2;  
const path = require('path');  
const dotenv = require('dotenv');


//config the dotenv
dotenv.config();

//connecting to the cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});




async function uploadImage(localImagePath, folderName) {
  try {
    // Specify the folder name in the public_id
    const publicId = folderName ? `${folderName}/${path.basename(localImagePath, path.extname(localImagePath))}` : undefined;

    const result = await cloudinary.uploader.upload(localImagePath, { public_id: publicId });
    console.log('image uploaded to cloudinary')

    return result.secure_url; // Return the Cloudinary URL for the uploaded image

  } catch (error) {


    console.error('Error uploading image:', error);

    throw error; // Rethrow the error for handling in the calling code

  }
}



async function uploadImages(image) {
  const localImagePath = path.join(__dirname, image);
  return await uploadImage(localImagePath, 'instagram')
}





module.exports = uploadImages;