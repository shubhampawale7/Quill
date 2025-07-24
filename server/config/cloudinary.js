import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// This configures the Cloudinary SDK with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This creates a storage engine for Multer to upload files to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quill_uploads", // The name of the folder in Cloudinary

    // By removing the 'format' line, Cloudinary will auto-detect the file type.
    // We can also add a list of allowed formats for security.
    allowed_formats: ["jpeg", "jpg", "png", "webp", "gif"],

    public_id: (req, file) => "image-" + Date.now(), // Creates a unique file name
  },
});

export { cloudinary, storage };
