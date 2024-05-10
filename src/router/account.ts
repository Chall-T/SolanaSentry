import express from "express";
import {
  getTransactionsOfAccount,
  getTransactionsOfAccountRecursive,
} from "../controllers/accountData";
export default (router: express.Router) => {
  router.get("/accounts/:account/transactions/", getTransactionsOfAccount);
  router.get(
    "/accounts/:account/alltransactions/",
    getTransactionsOfAccountRecursive
  );
};
