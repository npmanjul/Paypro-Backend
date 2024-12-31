import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
  
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfull 
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got successfull
        return response;

    } catch (error) {
        console.log(error);
        // fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        // Use the destroy method to delete the image
        const imageDeleted = await cloudinary.uploader.destroy(publicId);

        if(!imageDeleted){
            return null;
        }
        return imageDeleted;

    } catch (error) {
        console.log(error);
        return null;
    }
}

// Function to extract the public_id from a Cloudinary URL

const extractPublicId = (url) => {
    // Match everything after '/image/upload/' and before the file extension
    const regex = /\/image\/upload\/(?:v[0-9]+\/)?([^\/.]+)/;
    const match = url.match(regex);
    if (match) {
        return match[1]; // This is the public_id
    } else {
        return null; // Return null if the format doesn't match
    }
};



export {uploadOnCloudinary,deleteFromCloudinary,extractPublicId}