import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Generic storage for any file upload
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = "user-uploads";
        
        // Determine folder based on field name
        if (file.fieldname === "completion_image") {
            folder = "service-completion";
        } else if (file.fieldname === "image") {
            folder = "service-request";
        }
        
        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png']
        };
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

export default upload;