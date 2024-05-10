import express from "express";
import { solanaConnection } from "../utils/general";
import {
  PublicKey,
  Connection,
  SignaturesForAddressOptions,
  ConfirmedSignatureInfo,
} from "@solana/web3.js";

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const getTransactionsOfAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { account } = req.params;
    const { before } = req.query;
    if (!account) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let pubKey = new PublicKey(account);

    try {
      pubKey = new PublicKey(account);
    } catch (error) {
      return next({ statusCode: 400, message: "Invalid public key input" });
    }
    const options: SignaturesForAddressOptions = {};
    if (typeof before === "string") {
      options.before = before;
    }
    let accounts = await solanaConnection.getSignaturesForAddress(
      pubKey,
      options,
      "finalized"
    );

    if (!accounts) {
      return next({ message: "No Signatures found" });
    }
    return res.status(200).json({ data: accounts });
  } catch (error) {
    return next(error);
  }
};
const getTransactionsOfAccountRecursiveFromRPC = async (
  pubKey: PublicKey,
  signatures: ConfirmedSignatureInfo[],
  lastSignature?: ConfirmedSignatureInfo
) => {
  let options: SignaturesForAddressOptions = {};
  if (lastSignature) {
    options.before = lastSignature.signature;
  }
  let accounts = await solanaConnection.getSignaturesForAddress(
    pubKey,
    options,
    "finalized"
  );
  console.log(
    `getSignaturesForAddress last signature ${accounts.at(-1)?.blockTime}`
  );
  const newLastSignature = accounts.at(-1);
  signatures = [...accounts];
  if (accounts.length == 1000) {
    let result = await getTransactionsOfAccountRecursiveFromRPC(
      pubKey,
      signatures,
      newLastSignature
    );
    return signatures;
  } else {
    writeFileSync(join(__dirname, "signatures.json"), signatures.toString(), {
      flag: "w",
    });
  }
};

export const getTransactionsOfAccountRecursive = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { account } = req.params;
    const { before } = req.query;
    if (!account) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let pubKey;
    try {
      pubKey = new PublicKey(account);
    } catch (error) {
      return next({ statusCode: 400, message: "Invalid public key input" });
    }
    const result = await getTransactionsOfAccountRecursiveFromRPC(pubKey, []);

    if (!result) {
      return next({ message: "No Signatures found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return next(error);
  }
};
