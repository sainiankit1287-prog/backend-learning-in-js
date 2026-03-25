import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null;

        // extract public_id from URL
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1]; // abc123.jpg
        const publicId = fileName.split(".")[0]; // abc123

        const result = await cloudinary.uploader.destroy(publicId);

        return result;
    } catch (error) {
        console.log("Error deleting image from cloudinary:", error);
        return null;
    }
};

export default deleteFromCloudinary;