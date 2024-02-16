const cloudinaryModule = require("cloudinary");

dotenv.config();
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: dxk9nsers,
  api_key: 239389465974396,
  api_secret: l3sYHvtSlm-OhIHJXetMm0wVdl8,
});
module.exports = cloudinary;