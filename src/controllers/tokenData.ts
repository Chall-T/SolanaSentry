import express from "express";
import { solanaConnection } from "../utils/general";
import { PublicKey, Connection } from "@solana/web3.js";
import https from "https";
import { Market } from "@project-serum/serum";
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
  const timeStart = Date.now();
  try {
    pubKey = new PublicKey(token);
  } catch (error) {
    const timeStop = Date.now();
    return {
      statusCode: 400,
      message: "Invalid public key input",
      timeTaken: (timeStop - timeStart) / 1000,
    };
  }

  let accounts = await solanaConnection.getTokenLargestAccounts(pubKey);

  if (!accounts) {
    const timeStop = Date.now();
    return {
      statusCode: 500,
      message: "No Signatures found",
      timeTaken: (timeStop - timeStart) / 1000,
    };
  }

  let response: any = { statusCode: 200, data: accounts };
  const timeStop = Date.now();
  if (process.env.NODE_ENV === "development") {
    response.timeTaken = (timeStop - timeStart) / 1000;
  }
  return response;
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
    const timeStart = Date.now();
    https
      .get(`https://price.jup.ag/v4/price?ids=${token}`, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            let response: any = {
              statusCode: 200,
              data: JSON.parse(body)["data"],
            };
            const timeStop = Date.now();
            if (process.env.NODE_ENV === "development") {
              response.timeTaken = (timeStop - timeStart) / 1000;
            }
            resolve(response);
          } catch (err) {
            const timeStop = Date.now();
            reject({
              statusCode: 500,
              stack: err,
              timeTaken: (timeStop - timeStart) / 1000,
            });
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

export const getAllMarketsForCoinPlane = async (token: string) => {
  let pubKey;
  const timeStart = Date.now();
  try {
    pubKey = new PublicKey(token);
  } catch (error) {
    const timeStop = Date.now();
    return {
      statusCode: 400,
      message: "Invalid public key input",
      timeTaken: (timeStop - timeStart) / 1000,
    };
  }

  try {
    // Fetch all markets
    // const markets = await solanaConnection.getParsedTokenAccountsByOwner(
    //   pubKey,
    //   {
    //     programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    //   }
    // );

    // // Filter out only markets for the specified coin
    // const coinMarkets = markets.value.filter(
    //   (account) => account.account.data.parsed.info.tokenAmount.uiAmount > 0
    // );
    // solanaConnection.getTokenAccountsByOwner
    // solanaConnection.getParsedTokenAccountsByOwner
    let market = await Market.load(
      solanaConnection,
      pubKey,
      {},
      new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
    );
    let response: any = {
      statusCode: 200,
      data: market,
    };
    const timeStop = Date.now();
    if (process.env.NODE_ENV === "development") {
      response.timeTaken = (timeStop - timeStart) / 1000;
    }

    return response;
  } catch (error) {
    console.error("Error fetching markets:", error);
    const timeStop = Date.now();
    return {
      statusCode: 400,
      message: "Error fetching markets",
      stack: error,
      timeTaken: (timeStop - timeStart) / 1000,
    };
  }
};
export const getAllMarketsForCoin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let result = await getAllMarketsForCoinPlane(token);

    if (result.statusCode == 200) {
      return res.status(200).json({ data: result.data });
    } else {
      next(result);
    }
  } catch (error) {
    return next(error);
  }
};
