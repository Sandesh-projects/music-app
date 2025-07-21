import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './model/user.model.js'; // Ensure this path is correct

dotenv.config();

const ADMIN_EMAIL = 'admin@tunify.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456';

const createAdminAccount = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connection successful.");

        const adminExists = await User.findOne({ email: ADMIN_EMAIL });
        if (adminExists) {
            console.log("ℹ️ An admin account with this email already exists. Aborting.");
            return;
        }

        // We now pass the PLAIN TEXT password. The model will handle hashing.
        const adminUser = new User({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });

        await adminUser.save();
        console.log("✅ Admin account created successfully!");
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Email: ${adminUser.email}`);

    } catch (error) {
        console.error("❌ Error creating admin account:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Database connection closed.");
    }
};

createAdminAccount();