import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/api.js";
import response from "./utils/response.js";
import db from "./utils/db.js";

dotenv.config();

async function init() {
  try {
    const PORT = process.env.PORT || 3001;

    const result = await db();
    console.log(`Database status: ${result}`);

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/", (res) => {
      response.success(res, "Hello Weebz!", "Server is Running!!");
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is up and running on  https://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
