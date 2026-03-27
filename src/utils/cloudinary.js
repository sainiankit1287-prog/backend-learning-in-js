import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been upload successfully
        // console.log("cloudinary.js: file is upload successfully",response.url);
        //console.table(response);
        return response;// write respons to access file in controlers
        // now unlink the file sync 

    } catch (error) {
        //fs.unlinkSync(localFilePath)// remove the locally save temp file as the upload operation got failed
        console.log("cloudinary.js:", error);
        return null;


    }// after response it will delete local file 
    finally {
        try {
            if (localFilePath) {
                fs.unlinkSync(localFilePath);
            }
        } catch (error) {
             console.log("File cleanup failed:", error.message);
        }
    }
}


export { uploadOnCloudinary }
