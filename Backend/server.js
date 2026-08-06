import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


connectDB()
  .then(async () => {
  

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
