import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/api.js";
import response from "./utils/response.js";

async function init() {
  try {
    const PORT = process.env.PORT || 3001;

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      response.success(res, "Hello Weebz!", "Server is Running!!");
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is up and running on  http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
