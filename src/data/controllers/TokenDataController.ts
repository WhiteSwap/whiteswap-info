import dayjs from 'dayjs'
import { timestampUnitType } from 'constants/index'
import { ITokenDataController } from 'data/controllers/types/TokenController.interface'
import { tokenMapper, topTokensMapper, tokenChartDataMapper, tokenPriceDataMapper } from 'data/mappers/tokenMappers'
import { client } from 'service/client'
import {
  TokenQueryVariables,
  TokenQuery,
  TokensQuery,
  TokenPairsQuery,
  TokenPairsQueryVariables,
  TokenDailyPriceQuery,
  TokenDailyPriceQueryVariables,
  TokenHourlyPriceQuery,
  TokenHourlyPriceQueryVariables,
  TokenDailyDataQuery,
  TokenDailyDataQueryVariables
} from 'service/generated/graphql'
import {
  TOKENS,
  TOKEN,
  TOKEN_PAIRS,
  TOKEN_DAILY_PRICE,
  TOKEN_HOURLY_PRICE,
  TOKEN_DAILY_DATA
} from 'service/queries/tokens'

export default class TokenDataController implements ITokenDataController {
  // async searchToken(value: string, id: string) {
  //   return client.query({
  //     query: TOKEN_SEARCH,
  //     variables: {
  //       value,
  //       id
  //     }
  //   })
  // }

  async getTopTokens() {
    const { data } = await client.query<TokensQuery>({ query: TOKENS })
    return topTokensMapper(data)
  }

  async getTokenData(address: string) {
    const { data } = await client.query<TokenQuery, TokenQueryVariables>({
      query: TOKEN,
      variables: { address }
    })
    return tokenMapper(data.token)
  }

  async getTokenPairs(tokenAddress: string) {
    const { data } = await client.query<TokenPairsQuery, TokenPairsQueryVariables>({
      query: TOKEN_PAIRS,
      variables: { tokenAddress }
    })
    return data.tokenPairs
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getIntervalTokenData(tokenAddress: string, startTime: number, interval: number) {
    // TODO: fix interval format
    if (interval === 86_400) {
      const { data } = await client.query<TokenDailyPriceQuery, TokenDailyPriceQueryVariables>({
        query: TOKEN_DAILY_PRICE,
        variables: { startTime, id: tokenAddress }
      })
      return tokenPriceDataMapper(data?.tokenDailyPrice)
    } else {
      const { data } = await client.query<TokenHourlyPriceQuery, TokenHourlyPriceQueryVariables>({
        query: TOKEN_HOURLY_PRICE,
        variables: { startTime, id: tokenAddress }
      })
      return tokenPriceDataMapper(data?.tokenHourlyPrice)
    }
  }

  async getTokenChartData(tokenAddress: string, timeWindow: string) {
    const currentTime = dayjs.utc()
    const startTime = currentTime.subtract(1, timestampUnitType[timeWindow]).startOf('day').unix()

    const { data } = await client.query<TokenDailyDataQuery, TokenDailyDataQueryVariables>({
      query: TOKEN_DAILY_DATA,
      variables: { id: tokenAddress, startTime }
    })

    return { [timeWindow]: tokenChartDataMapper(data) }
  }
}
