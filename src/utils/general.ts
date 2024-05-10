import { Connection } from "@solana/web3.js";

const SOLANA_HTTP_RPC =
  process.env.SOL_HTTPS || "https://api.mainnet-beta.solana.com";

export const solanaConnection = new Connection(SOLANA_HTTP_RPC);
