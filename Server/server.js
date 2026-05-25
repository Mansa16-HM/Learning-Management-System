import dotenv from "dotenv";
dotenv.config();
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';
import './config/cloudinary.js';

import connectionToDB from './config/dbConnection.js';
import app from './app.js';

const PORT= process.env.PORT || 9000;

/**
 * @Cloudinary configuration for file storage service
 */
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:process.env.CLOUDINARY_SECURE,
})
/**
 * @Razorpay configuration for payment gateway
 */
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log("Razorpay initialized");
} else {
    console.log("Razorpay skipped (no keys)");
}

export { razorpay };
app.listen(PORT,async ()=>{
    await connectionToDB();
   console.log(`App is running at http://localhost:${PORT}`);
})