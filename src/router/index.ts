import express from "express";
import token from "./token";
import account from "./account";
export const router = express.Router();

export default (): express.Router => {
  account(router);
  token(router);
  return router;
};
