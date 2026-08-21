import multer from "multer";
import crypto from "crypto";
import { extname } from "path";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const extension = extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});
// for file check write code here and pass in upload function
const fileFilter = (req, file, cb) => {
  const allowedFileType = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/mpeg",
    "video/webm",
  ];
  if (allowedFileType.includes(file.mimetype)) {
    cb(null, true);
    /**
         * cb stands for "callback." It’s a function that tells the middleware what to do next.

         null: This represents the "error" argument. Passing null means "No error occurred."

        true: This tells the middleware, "Yes, this file is accepted. Save it."
         */
  } else {
    cb(new ApiError(415, "Media file is not supported, please upload a valid file"));
  }
};
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1000, // 1000 MB
  },
});

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
