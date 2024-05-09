import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

const SOLANA_HTTP_RPC =
  process.env.SOL_HTTPS || "https://api.mainnet-beta.solana.com";

export const getMetadataMP = async (mint: PublicKey) => {
  const connection = new Connection(SOLANA_HTTP_RPC);
  const metaplex = Metaplex.make(connection);

  const metadataAccount = metaplex.nfts().pdas().metadata({ mint });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mint });

    return token;
  }
};
