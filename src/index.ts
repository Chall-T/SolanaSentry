import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + `/../.env.${process.env.NODE_ENV}` });
import express from "express";
import http from "http";
import { server } from "./utils/server";

const app = server();

const API = http.createServer(app);

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || "localhost";

API.listen(PORT, () => {
  console.log(`Server is running on http://${DOMAIN}:${PORT}`);
});
