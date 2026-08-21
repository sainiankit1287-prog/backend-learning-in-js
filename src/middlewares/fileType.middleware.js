import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const strictFileCheck = asyncHandler(async (req, res, next) => {
  const allowedTypesByField = {
    videoFile: ["video/mp4", "video/mpeg", "video/webm"],
    thumbnail: ["image/jpeg", "image/png", "image/webp"],
  };

  try {
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return next();
    }

    for (const [fieldName, fileArray] of Object.entries(files)) {
      const allowedTypes = allowedTypesByField[fieldName];

      if (!allowedTypes) {
        throw new ApiError(400, `Unexpected file field: ${fieldName}`);
      }

      for (const file of fileArray) {
        const fileInfo = await fileTypeFromFile(file.path);

        if (!fileInfo) {
          await fs.unlink(file.path).catch(() => {});
          throw new ApiError(415, `${fieldName} file type could not be detected`);
        }

        if (!allowedTypes.includes(fileInfo.mime)) {
          await fs.unlink(file.path).catch(() => {});
          throw new ApiError(415, `${fieldName} file type is not supported`);
        }
      }
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, error.message || "Error while validating files");
  }
});
