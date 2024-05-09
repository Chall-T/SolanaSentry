import express from "express";
import * as dotenv from "dotenv";
import http from 'http';
import {server} from "./utils/server"
dotenv.config({ path: __dirname + "/../.env" });


const app = server()

const API = http.createServer(app)


const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || "localhost";

API.listen(PORT, () => {
  console.log(`Server is running on http://${DOMAIN}:${PORT}`);
});
