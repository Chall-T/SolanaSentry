import express from "express";
import { getMetadata, getMetadataNoParams } from "../controllers/metadata";
export default (router: express.Router) => {
  router.get("/metadata/:token", getMetadata);
  router.get("/metadata/", getMetadataNoParams);
};
