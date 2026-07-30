import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return;

  const existing = await User.findOne({ email: adminEmail });

  if (existing) return;

  await User.create({
    name: "Admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    applicationStatus: "approved",
  });

  console.log(`Seeded admin account: ${adminEmail}`);
};

connectDB()
  .then(async () => {
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });