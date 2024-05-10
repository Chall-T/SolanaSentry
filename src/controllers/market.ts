declare var graphQL: any;
// import { gql, GraphQLClient } from "graphql-request";
import express from "express";
const endpoint = `https://programs.shyft.to/v0/graphql/?api_key=YOUR-KEY`;

export const getLpByTokenPlane = async (token: string) => {
  try {
    const timeStart = Date.now();
    const query = /* GraphQL */ `
      query MyQuery($where: Raydium_LiquidityPoolv4_bool_exp) {
        Raydium_LiquidityPoolv4(
          where: {
            _or: [
              {
                baseMint: {
                  _eq: "${token}"
                }
              }
              {
                quoteMint: {
                  _eq: "${token}"
                }
              }
            ]
          }
        ) {
          _updatedAt
          amountWaveRatio
          baseDecimal
          baseLotSize
          baseMint
          baseNeedTakePnl
          baseTotalPnl
          baseVault
          depth
          lpMint
          lpReserve
          lpVault
          marketId
          marketProgramId
          maxOrder
          maxPriceMultiplier
          minPriceMultiplier
          minSeparateDenominator
          minSeparateNumerator
          minSize
          nonce
          openOrders
          orderbookToInitTime
          owner
          pnlDenominator
          pnlNumerator
          poolOpenTime
          punishCoinAmount
          punishPcAmount
          quoteDecimal
          quoteLotSize
          quoteMint
          quoteNeedTakePnl
          quoteTotalPnl
          quoteVault
          resetFlag
          state
          status
          swapBase2QuoteFee
          swapBaseInAmount
          swapBaseOutAmount
          swapFeeDenominator
          swapFeeNumerator
          swapQuote2BaseFee
          swapQuoteInAmount
          swapQuoteOutAmount
          systemDecimalValue
          targetOrders
          tradeFeeDenominator
          tradeFeeNumerator
          volMaxCutRatio
          withdrawQueue
          pubkey
        }
        ORCA_WHIRLPOOLS_whirlpool(
          where: {
            _or: [
              {
                tokenMintA: {
                  _eq: "${token}"
                }
              }
              {
                tokenMintB: {
                  _eq: "${token}"
                }
              }
            ]
          }
        ) {
          whirlpoolsConfig
          whirlpoolBump
          tokenVaultB
          tokenVaultA
          tokenMintB
          tokenMintA
          tickSpacingSeed
          tickSpacing
          tickCurrentIndex
          sqrtPrice
          rewardLastUpdatedTimestamp
          rewardInfos
          pubkey
          protocolFeeRate
          protocolFeeOwedB
          protocolFeeOwedA
          liquidity
          feeRate
          feeGrowthGlobalB
          feeGrowthGlobalA
          _lamports
        }
        meteora_dlmm_LbPair(
          where: {
            _or: [
              {
                tokenXMint: {
                  _eq: "${token}"
                }
              }
              {
                tokenYMint: {
                  _eq: "${token}"
                }
              }
            ]
          }
        ) {
          whitelistedWallet
          vParameters
          tokenYMint
          tokenXMint
          swapCapDeactivateSlot
          status
          rewardInfos
          reserved
          reserveY
          reserveX
          pubkey
          protocolFee
          parameters
          pairType
          padding1
          oracle
          maxSwappedAmount
          lastUpdatedAt
          feeOwner
          bumpSeed
          binStepSeed
          binStep
          baseKey
          binArrayBitmap
          activeId
          activationSlot
          _lamports
        }
        Fluxbeam_TokenSwap(
          where: {
            _or: [
              { mintB: { _eq: "${token}" } }
              { mintA: { _eq: "${token}" } }
            ]
          }
        ) {
          version
          tradeFeeNumerator
          tradeFeeDenominator
          tokenPool
          tokenAccountB
          tokenAccountA
          pubkey
          poolTokenProgramId
          ownerWithdrawFeeDenominator
          ownerWithdrawFeeNumerator
          ownerTradeFeeNumerator
          ownerTradeFeeDenominator
          mintB
          mintA
          isInitialized
          hostFeeNumerator
          hostFeeDenominator
          curveType
          feeAccount
          curveParameters
          bumpSeed
        }
      }
    `;

    const res = await fetch(
      `https://programs.shyft.to/v0/graphql/?api_key=${process.env.SHYFT_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      }
    );
    const data: any = await res.json();
    let response: any = {
      statusCode: 200,
      data: data["data"],
    };
    const timeStop = Date.now();
    if (process.env.NODE_ENV === "development") {
      response.timeTaken = (timeStop - timeStart) / 1000;
    }
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching markets",
      stack: error,
    };
  }
};
export const getLpByToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      return next({ statusCode: 400, message: "Missing params" });
    }

    let result: any = await getLpByTokenPlane(token);
    if (result.statusCode == 200) {
      return res.status(200).json({ data: result.data });
    } else {
      next(result);
    }
  } catch (error) {
    return next(error);
  }
};
