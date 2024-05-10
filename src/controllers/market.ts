declare var graphQL: any;
// import { gql, GraphQLClient } from "graphql-request";
import express from "express";
const endpoint = `https://programs.shyft.to/v0/graphql/?api_key=YOUR-KEY`;

export const getLpByTokenPlane = async (token: string) => {
  try {
    const timeStart = Date.now();
    const query = /* GraphQL */ `
      query MyQuery($where: Raydium_LiquidityPoolv4_bool_exp) {
        Raydium_LiquidityPoolv4(where: $where) {
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
      }
    `;

    const variables = {
      where: {
        _or: [
          { baseMint: { _eq: token } },
          {
            quoteMint: { _eq: token },
          },
        ],
      },
    };
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
          variables: variables,
        }),
      }
    );
    const data = await res.json();
    let response: any = {
      statusCode: 200,
      data,
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
