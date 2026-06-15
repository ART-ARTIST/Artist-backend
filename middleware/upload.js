// import multer from "multer";
// import path from "path";

// // STORAGE CONFIG
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + "-" + file.originalname.replace(/\s/g, "")
//     );
//   },
// });


// // FILE FILTER (only images allowed)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;

//   const extName = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );

//   const mimeType = allowedTypes.test(file.mimetype);

//   if (extName && mimeType) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed!"));
//   }
// };


// // MULTER EXPORT
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max
//   },
// });

// export default upload;




import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp"
    ],
  },
});

const upload = multer({
  storage,
});

export default upload;