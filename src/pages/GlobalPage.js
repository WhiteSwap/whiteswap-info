import styled from 'styled-components/macro'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

import { useGlobalTransactions } from 'state/features/global/hooks'
import { useGlobalDataSelector } from 'state/features/global/selectors'
import { useFormatPath } from 'hooks'
import { usePairs } from 'state/features/pairs/selectors'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { formattedNum } from '../utils'
import { DashboardWrapper, TYPE } from '../Theme'
import { CustomLink } from '../components/Link'

import { PageWrapper, ContentWrapper } from '../components'
import { useTranslation } from 'react-i18next'
import { useTokens } from 'state/features/token/selectors'
import Percent from 'components/Percent'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

function GlobalPage() {
  const { t } = useTranslation()
  const formatPath = useFormatPath()

  // get data for lists and totals
  const allPairs = usePairs()
  const allTokens = useTokens()
  const transactions = useGlobalTransactions()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalDataSelector()

  // breakpoints
  const below440 = useMedia('(max-width: 440px)')
  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <ContentWrapper>
        <DashboardWrapper>
          <AutoColumn gap={below440 ? '.75rem' : '1.5rem'} style={{ paddingBottom: below800 ? '0' : '24px' }}>
            <RowBetween>
              <TYPE.largeHeader>
                {below800 ? t('protocolAnalytics') : `WhiteSwap ${t('protocolAnalytics')}`}
              </TYPE.largeHeader>
              {!below800 && <Search small={true} />}
            </RowBetween>
            <GlobalStats />
          </AutoColumn>
          {below800 && ( // mobile card
            <Panel
              style={{
                marginBottom: '1.5rem'
              }}
            >
              <AutoColumn gap={'2.25rem'}>
                <AutoColumn gap="1rem">
                  <RowBetween>
                    <TYPE.light>{t('volume24hrs')}</TYPE.light>
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={below440 ? '1.25rem' : '1.5rem'} lineHeight={1} fontWeight={600}>
                      {formattedNum(oneDayVolumeUSD, true)}
                    </TYPE.main>
                    <TYPE.main fontSize={12}>
                      <Percent percent={volumeChangeUSD} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
                <AutoColumn gap="1rem">
                  <RowBetween>
                    <TYPE.light>{t('totalLiquidity')}</TYPE.light>
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={below440 ? '1.25rem' : '1.5rem'} lineHeight={1} fontWeight={600}>
                      {formattedNum(totalLiquidityUSD, true)}
                    </TYPE.main>
                    <TYPE.main fontSize={12}>
                      <Percent percent={liquidityChangeUSD} />
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </AutoColumn>
            </Panel>
          )}
          {!below800 && (
            <GridRow>
              <GlobalChart display="liquidity" />
              <GlobalChart display="volume" />
            </GridRow>
          )}
          {below800 && (
            <AutoColumn style={{ marginTop: '6px' }} gap="24px">
              <GlobalChart display="liquidity" />
            </AutoColumn>
          )}
        </DashboardWrapper>

        <DashboardWrapper style={{ marginTop: '1rem' }}>
          <ListOptions gap="10px" style={{ marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={22} fontWeight={500}>
                {t('topTokens')}
              </TYPE.main>
              <CustomLink to={formatPath('/tokens')}>{t('seeAll')}</CustomLink>
            </RowBetween>
          </ListOptions>
          <TopTokenList tokens={allTokens} />
        </DashboardWrapper>

        <DashboardWrapper style={{ marginTop: '1rem' }}>
          <ListOptions gap="10px" style={{ marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={22} fontWeight={500}>
                {t('topPairs')}
              </TYPE.main>
              <CustomLink to={formatPath(`/pairs`)}>{t('seeAll')}</CustomLink>
            </RowBetween>
          </ListOptions>
          <PairList pairs={allPairs} />
        </DashboardWrapper>

        <DashboardWrapper style={{ marginTop: '1rem' }}>
          <TYPE.main fontSize={22} fontWeight={500}>
            {t('transactions')}
          </TYPE.main>
          <TxnList transactions={transactions} />
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default GlobalPage
