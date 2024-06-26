import express from "express";
import { getMetadata } from "../controllers/metadata";
import {
  getTransactions,
  getTokenLargestAccounts,
  getTokenPrice,
  getAllMarketsForCoin,
} from "../controllers/tokenData";
import { getLpByToken } from "../controllers/market";
import { getTokenReport } from "../controllers/report";

export default (router: express.Router) => {
  router.get("/tokens/:token/report/", getTokenReport);
  router.get("/tokens/:token/metadata/", getMetadata);
  router.get("/tokens/:token/transactions", getTransactions);
  router.get("/tokens/:token/accounts/", getTokenLargestAccounts);
  router.get("/tokens/:token/price/", getTokenPrice);
  router.get("/tokens/:token/markets/", getLpByToken);
};
