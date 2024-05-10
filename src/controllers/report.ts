import { getMetadataPlane } from "./metadata";
import { getTokenLargestAccountsPlane, getTransactions } from "./tokenData";
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

    let [metadataResult, largestAccountsResult] = await Promise.allSettled([
      getMetadataPlane(token),
      getTokenLargestAccountsPlane(token),
    ]);
    let response = {
      metadata: metadataResult,
      largestAccounts: largestAccountsResult,
    };
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};
