import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const upload = multer({ storage });

router.post("/", protect, upload.single("image"), (req, res) => {
  if (req.file) {
    res.status(201).send({
      message: "Image Uploaded Successfully",
      image: req.file.path,
    });
  } else {
    res.status(400).send({ message: "Image upload failed" });
  }
});

export default router;
