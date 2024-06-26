import { AccountChartData, PositionChartData, PositionChartView } from 'state/features/account/types'
import { PairDetails } from 'state/features/pairs/types'

export interface IAccountDataController {
  /**
   *  Fetch all the snapshots of liquidity activity for this account.
   * Each snapshot is a moment when an LP position was created or updated.
   * @param  {string} account - user wallet address
   * @param  {number} skip - offset
   */
  getUserLiquidityChart(account: string, timeWindow: string): Promise<Record<string, AccountChartData[]>>
  /**
   * Fetch user active liquidity positions.
   * Get user liquidity pools,
   * information about amount of supplied tokens in each pool
   * @param  {string} account - user wallet address
   */
  getUserPositions(account: string): Promise<Position[]>
  /**
   * Fetch rating list of liquidity position for specific pair address.
   * List sorts by liquidity token balance
   *
   * @param  {string} pair - pair address
   */
  getTopLps(): Promise<LiquidityPosition[]>
  /**
   * formats data for historical chart for an LPs position in 1 pair over time
   * @param accountAddress // account address to load data
   * @param pair // current stat of the pair
   * @param timeWindow // period of time
   * @param pairSnapshots // history of entries and exits for lp on this pair
   */
  getPositionChart(
    accountAddress: string,
    pair: PairDetails,
    timeWindow: string,
    key: PositionChartView
  ): Promise<Partial<PositionChartData>>
}
