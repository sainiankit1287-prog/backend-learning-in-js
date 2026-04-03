import { fileTypeFromFile } from "file-type";
import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const strictFileCheck = asyncHandler(async (req, res, next) => {
    try {
        const files = req.files;

        if (!files) {
            throw new ApiError(400, "No files uploaded");
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/mpeg",
            "text/plain"
        ];

        for (const fieldName in files) {
            const fileArray = files[fieldName];

            for (const file of fileArray) {
                const fileInfo = await fileTypeFromFile(file.path);

                if (!fileInfo || !allowedTypes.includes(fileInfo.mime)) {
                    fs.unlinkSync(file.path);

                    throw new ApiError(
                        415,
                        `${fieldName} file type is not supported`
                    );
                }
            }
        }

        next();
    } catch (error) {
        throw new ApiError(
             500,
            error.message || "Error while validating files"
        );
    }
});