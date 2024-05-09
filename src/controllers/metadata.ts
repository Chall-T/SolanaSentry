import express from "express";
import { getMetadataMP } from "../utils/metadata";
import { PublicKey } from "@solana/web3.js";

import base58 from "bs58";

export const getMetadata = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;

    if (!token) {
      next({ statusCode: 400, message: "Missing params" });
    }
    let metadata;
    try {
      metadata = await getMetadataMP(new PublicKey(token));
    } catch (error) {
      next({ statusCode: 400, message: "Invalid public key input" });
    }
    if (!metadata) {
      next({ statusCode: 404, message: "Token not found" });
      return;
    }
    return res.status(200).json({ data: metadata }).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMetadataNoParams = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  next({ statusCode: 400, message: "Missing params" });
};
