import express from "express";
import { getMetadataMP } from "../utils/metadata";
import { PublicKey } from "@solana/web3.js";

import base58 from "bs58";

export const getMetadataPlane = async (token: string) => {
  let metadata;
  try {
    metadata = await getMetadataMP(new PublicKey(token));
  } catch (error) {
    return { statusCode: 400, message: "Invalid public key input" };
  }

  if (!metadata) {
    return { statusCode: 404, message: "Token not found" };
  }

  return { statusCode: 200, data: metadata };
};

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
    let result = await getMetadataPlane(token);

    if (result.statusCode == 200) {
      return res.status(200).json({ data: result.data });
    } else {
      next(result);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
