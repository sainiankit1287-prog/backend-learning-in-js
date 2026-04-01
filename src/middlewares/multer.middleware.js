import multer from "multer";


const storage=multer.diskStorage({
    destination:function(req,file,cb) {
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb) {
        cb(null,file.originalname)
    }

})
export const upload=multer({
    storage,
     limits: {
        fileSize: 1024 * 1024 * 1000 // ✅ 500 MB
    }
})

// if multiple file are uploaded then can overwrite so try give unique name to file  
/*
Avoid using file.originalname directly, as it can cause file overwriting and security issues; instead, generate unique filenames using timestamps or random values.

Add file type validation using a fileFilter to restrict uploads to allowed formats like images or PDFs.

Define file size limits to prevent large or malicious uploads that could affect server performance.

Implement proper error handling for scenarios like invalid file types, file size exceedance, or upload failures.

Improve security by not trusting user-provided filenames and preventing path traversal or malicious file uploads.

Use Node.js path module instead of hardcoded paths for better cross-platform compatibility.

Organize uploads into a proper folder structure (e.g., /uploads/images, /uploads/docs) instead of keeping everything in a temp folder.

Clean up temporary files after processing to avoid unnecessary storage usage.

For production environments, avoid relying only on local disk storage and consider using cloud storage solutions like AWS S3 or Cloudinary.
*/  