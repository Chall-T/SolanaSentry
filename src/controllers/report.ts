import { getMetadataPlane } from "./metadata";
import {
  getTokenLargestAccountsPlane,
  getTransactions,
  getTokenPricePlane,
} from "./tokenData";
import express from "express";

export const getTokenReport = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;

    if (!token) {
      next({ statusCode: 400, message: "Missing params" });
    }

    let [metadataResult, largestAccountsResult, priceResult] =
      await Promise.allSettled([
        getMetadataPlane(token),
        getTokenLargestAccountsPlane(token),
        getTokenPricePlane(token),
      ]);
    let response = {
      metadata: metadataResult,
      largestAccounts: largestAccountsResult,
      price: priceResult,
    };
    return res.status(200).json({ data: response });
  } catch (error) {
    return next(error);
  }
};
