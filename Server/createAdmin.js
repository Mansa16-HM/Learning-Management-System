import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/usermodel.js";

/**
 * Load .env file
 */
dotenv.config({ path: "./.env" });

/**
 * Connect MongoDB
 */
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

/**
 * Create Admin
 */
const createAdmin = async () => {

    try {

        // Check existing admin
        const adminExists = await User.findOne({
            email: "admin@gmail.com"
        });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit();
        }

        // Create admin user
        const admin = await User.create({
            fullName: "Admin User",
            email: "admin@gmail.com",
            password: "Admin@123",
            role: "ADMIN",

            avatar: {
                public_id: "admin",
                secure_url:
                    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            },
        });

        console.log("Admin created successfully");
        console.log(admin);

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit();
    }
};

createAdmin();