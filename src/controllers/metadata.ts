import express from "express";
import { getMetadataMP } from "../utils/metadata";
import { PublicKey } from "@solana/web3.js";

import base58 from "bs58";

export const getMetadataPlane = async (token: string) => {
  let metadata;
  const timeStart = Date.now();
  try {
    metadata = await getMetadataMP(new PublicKey(token));
  } catch (error) {
    const timeStop = Date.now();
    return { statusCode: 400, message: "Invalid public key input" };
  }

  if (!metadata) {
    const timeStop = Date.now();
    return { statusCode: 404, message: "Token not found" };
  }
  let response: any = { statusCode: 200, data: metadata };
  const timeStop = Date.now();
  if (process.env.NODE_ENV === "development") {
    response.timeTaken = (timeStop - timeStart)/1000;
  }
  return response;
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
