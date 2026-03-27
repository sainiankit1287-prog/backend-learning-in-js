import { v2 as cloudinary } from "cloudinary";

const replaceOnCloudinary = async (localFilePath, oldImageUrl) => {
    try {
        if (!localFilePath || !oldImageUrl) return null;

        // extract public_id from old URL
        const parts = oldImageUrl.split("/");
        const fileWithExt = parts.slice(parts.indexOf("upload") + 1).join("/");
        const publicId = fileWithExt.split(".")[0];

        // upload new file with same public_id (overwrite)
        const result = await cloudinary.uploader.upload(localFilePath, {
            public_id: publicId,
            overwrite: true,
            resource_type: "auto",
        });

        return result;

    } catch (error) {
        console.log("Error replacing image:", error);
        return null;
    }
};
export default replaceOnCloudinary;




// import { v2 as cloudinary } from "cloudinary";

// const deleteFromCloudinary = async (imageUrl) => {
//     try {
//         if (!imageUrl) return null;

//         // extract public_id from URL
//         // const urlParts = imageUrl.split("/");
//         // const fileName = urlParts[urlParts.length - 1]; // abc123.jpg
//         // const publicId = fileName.split(".")[0]; // abc123

//         // const result = await cloudinary.uploader.destroy(publicId);


//         return result;
//     } catch (error) {
//         console.log("Error deleting image from cloudinary:", error);
//         return null;
//     }
// };

// export default deleteFromCloudinary;


// this from cloudinary 

/*
cloudinary.v2.uploader
.upload("dog.mp4", {
  resource_type: "video", 
  public_id: "my_dog",
  overwrite: true, 
  notification_url: "https://mysite.example.com/notify_endpoint"})
.then(result=>console.log(result));

 */