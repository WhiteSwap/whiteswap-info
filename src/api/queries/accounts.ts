import { BURN_DETAILS, MINT_DETAILS, SWAP_DETAILS } from 'api/fragments'
import { gql } from 'apollo-boost'

// FIXME: no swap data
export const USER_MINTS_BUNRS_PER_PAIR = gql`
  query UserDataBulkPerPair($user: Bytes!, $pair: Bytes!) {
    mints(where: { to: $user, pair: $pair }) {
      amountUSD
      amount0
      amount1
      timestamp
      pair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
    burns(where: { sender: $user, pair: $pair }) {
      amountUSD
      amount0
      amount1
      timestamp
      pair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`

export const USER_HISTORY = gql`
  query LpSnapshots($user: Bytes!, $skip: Int!) {
    liquidityPositionSnapshots(first: 1000, skip: $skip, where: { user: $user }) {
      timestamp
      reserveUSD
      liquidityTokenBalance
      liquidityTokenTotalSupply
      reserve0
      reserve1
      token0PriceUSD
      token1PriceUSD
      pair {
        id
        reserve0
        reserve1
        reserveUSD
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`

export const USER_POSITIONS = gql`
  query LiquidityPositions($user: Bytes!) {
    liquidityPositions(where: { user: $user }) {
      pair {
        id
        reserve0
        reserve1
        reserveUSD
        token0 {
          id
          symbol
          derivedETH
        }
        token1 {
          id
          symbol
          derivedETH
        }
        totalSupply
      }
      liquidityTokenBalance
    }
  }
`

export const USER_TRANSACTIONS = gql`
  ${MINT_DETAILS}
  ${BURN_DETAILS}
  ${SWAP_DETAILS}
  query Transactions($user: Bytes!) {
    mints(orderBy: timestamp, orderDirection: desc, where: { to: $user }) {
      ...MintDetails
    }
    burns(orderBy: timestamp, orderDirection: desc, where: { sender: $user }) {
      ...BurnDetails
    }
    swaps(orderBy: timestamp, orderDirection: desc, where: { to: $user }) {
      ...SwapDetails
    }
  }
`

export const TOP_LPS_PER_PAIRS = gql`
  query TopLiquidityPositions($pair: Bytes!) {
    liquidityPositions(where: { pair: $pair }, orderBy: liquidityTokenBalance, orderDirection: desc, first: 10) {
      user {
        id
      }
      pair {
        id
      }
      liquidityTokenBalance
    }
  }
`

export const MINING_POSITIONS = (account: string) => {
  const queryString = `
    query UserMiningPositions {
      user(id: "${account}") {
        miningPosition {
          id
          user {
            id
          }
          miningPool {
              pair {
                id
                token0
                token1
              }
          }
          balance
        }
      }
    }
`
  return gql(queryString)
}
