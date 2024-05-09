import bodyParser from "body-parser";
import express, { response } from "express";
import cors from "cors";
import router from "../router";
import ErrorHandler from "../middleware/errorHandler";

export const server = () => {
  const app = express();
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", router());

  app.use(ErrorHandler);

  return app;
};
