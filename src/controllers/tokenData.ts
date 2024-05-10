import express from "express";
import { solanaConnection } from "../utils/general";
import { PublicKey, Connection } from "@solana/web3.js";
import https from "https";
import { SentryError } from "../middleware/errorHandler";

const getTransactionsFromRPC = async (address: PublicKey) => {
  const pubKey = new PublicKey(address);
  let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {
    limit: 1000,
  });
  return transactionList;
};
export const getTransactions = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let pubKey = new PublicKey(token);

    try {
      pubKey = new PublicKey(token);
    } catch (error) {
      return next({ statusCode: 400, message: "Invalid public key input" });
    }

    let transactionList = await getTransactionsFromRPC(pubKey);

    if (!transactionList) {
      return next({ message: "No Signatures found" });
    }
    return res.status(200).json({ data: transactionList });
  } catch (error) {
    return next(error);
  }
};

export const getTokenLargestAccountsPlane = async (token: string) => {
  let pubKey;

  try {
    pubKey = new PublicKey(token);
  } catch (error) {
    return { statusCode: 400, message: "Invalid public key input" };
  }

  let accounts = await solanaConnection.getTokenLargestAccounts(pubKey);

  if (!accounts) {
    return { statusCode: 500, message: "No Signatures found" };
  }

  return { statusCode: 200, data: accounts };
};

export const getTokenLargestAccounts = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let result = await getTokenLargestAccountsPlane(token);

    if (result.statusCode == 200) {
      return res.status(200).json({ data: result.data });
    } else {
      next(result);
    }
  } catch (error) {
    return next(error);
  }
};
interface TokenPriceResponse {
  statusCode: number;
  data: any; 
}

export const getTokenPricePlane = async (token: string) => {
  return new Promise<TokenPriceResponse>((resolve, reject) => {
    https
      .get(`https://price.jup.ag/v4/price?ids=${token}`, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: 200, data: JSON.parse(body)["data"] });
          } catch (err) {
            reject({ statusCode: 500, stack: err });
          }
        });
      })
      .on("error", reject);
  });
};

export const getTokenPrice = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let result = await getTokenPricePlane(token);

    if (result.statusCode == 200) {
      return res.status(200).json({ data: result.data });
    } else {
      next(result);
    }
  } catch (error) {
    return next(error);
  }
};
