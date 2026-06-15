// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/banners");
//   },

//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() +
//         path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage,
// });

// export default upload;









import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "mp4",
      "mov",
      "avi",
    ],
  },
});

const upload = multer({
  storage,
});

export default upload;