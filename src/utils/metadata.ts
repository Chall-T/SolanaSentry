import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { solanaConnection } from "../utils/general";

export const getMetadataMP = async (mint: PublicKey) => {
  const metaplex = Metaplex.make(solanaConnection);

  const metadataAccount = metaplex.nfts().pdas().metadata({ mint });

  const metadataAccountInfo = await solanaConnection.getAccountInfo(
    metadataAccount
  );

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mint });

    return token;
  }
};
