import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components/macro'

import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { formattedNum, formattedPercent } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../Theme'
import { transparentize } from 'polished'
import Panel from '../Panel'
import { useTranslation } from 'react-i18next'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;

  @media screen and (max-width: 440px) {
    margin-top: 0.75rem;
  }
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${props => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 1rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.bg7};

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr;
    grid-template-areas: ' name liq vol';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => transparentize(0.3, theme.text6)};
  user-select: none;
  text-align: end;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  ${({ active = true }) =>
    active &&
    `
    &:hover {
      opacity: 0.6;
    }
  `}

  @media screen and (max-width: 440px) {
    font-size: 10px;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => transparentize(0.5, theme.text6)};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 440px) {
    font-size: 12px;
  }

  @media screen and (max-width: 600px) {
    font-size: 10px;
  }
`

const Link = styled(CustomLink)`
  font-size: 14px;
  line-height: 16px;
  font-weight: 700;
  margin-left: 20px;
  white-space: nowrap;

  > div {
    color: ${({ theme }) => theme.blueGrey} !important;
  }
`

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5
}

const FIELD_TO_VALUE = {
  [SORT_FIELD.LIQ]: 'trackedReserveUSD', // sort with tracked volume only
  [SORT_FIELD.VOL]: 'oneDayVolumeUSD',
  [SORT_FIELD.VOL_7DAYS]: 'oneWeekVolumeUSD',
  [SORT_FIELD.FEES]: 'oneDayVolumeUSD'
}

function PairList({ pairs, disbaleLinks, maxItems = 10 }) {
  const { t } = useTranslation()

  const below440 = useMedia('(max-width: 440px)')
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below1080 = useMedia('(max-width: 1080px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress]

    if (pairData && pairData.token0 && pairData.token1) {
      const liquidity = formattedNum(pairData.reserveUSD, true)
      const volume = formattedNum(pairData.oneDayVolumeUSD, true)
      const apy = formattedPercent((pairData.oneDayVolumeUSD * 0.003 * 365 * 100) / pairData.reserveUSD)

      return (
        <DashGrid style={{ padding: below440 ? '.75rem' : '.875rem 2rem' }} disbaleLinks={disbaleLinks} focus={true}>
          <DataText area="name" fontWeight="500">
            {!below600 && <div style={{ marginRight: '20px', width: '10px' }}>{index}</div>}
            {!below440 && (
              <DoubleTokenLogo
                size={below600 ? 16 : 20}
                a0={pairData.token0.id}
                a1={pairData.token1.id}
                margin={!below740}
              />
            )}
            <Link to={'/pair/' + pairAddress} style={{ marginLeft: below440 && 0 }}>
              <FormattedName
                text={pairData.token0.symbol + '-' + pairData.token1.symbol}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
                fontSize={below440 ? 10 : 14}
              />
            </Link>
          </DataText>
          <DataText area="liq">{liquidity}</DataText>
          <DataText area="vol">{volume}</DataText>
          {!below1080 && <DataText area="volWeek">{formattedNum(pairData.oneWeekVolumeUSD, true)}</DataText>}
          {!below1080 && <DataText area="fees">{formattedNum(pairData.oneDayVolumeUSD * 0.003, true)}</DataText>}
          {!below1080 && <DataText area="apy">{apy}</DataText>}
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const pairList =
    pairs &&
    Object.keys(pairs)
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA]
        const pairB = pairs[addressB]
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 = parseFloat(pairA.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairA.reserveUSD)
          const apy1 = parseFloat(pairB.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairB.reserveUSD)
          return apy0 > apy1 ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(pairA[FIELD_TO_VALUE[sortedColumn]]) > parseFloat(pairB[FIELD_TO_VALUE[sortedColumn]])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index}>
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  return (
    <div>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid
          center={true}
          disbaleLinks={disbaleLinks}
          style={{ height: 'fit-content', padding: below440 ? '.75rem' : '1rem 2rem', borderTop: 'none' }}
        >
          <Flex alignItems="center" justifyContent="flexStart">
            <ClickableText active={false} style={{ justifyContent: 'flex-start' }}>
              {t('name')}
            </ClickableText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="liq"
              onClick={() => {
                setSortedColumn(SORT_FIELD.LIQ)
                setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
              }}
            >
              {t('liquidity')} {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          <Flex alignItems="center">
            <ClickableText
              area="vol"
              onClick={() => {
                setSortedColumn(SORT_FIELD.VOL)
                setSortDirection(sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection)
              }}
            >
              {t('volume24hrs')}
              {sortedColumn === SORT_FIELD.VOL ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText
                area="volWeek"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.VOL_7DAYS)
                  setSortDirection(sortedColumn !== SORT_FIELD.VOL_7DAYS ? true : !sortDirection)
                }}
              >
                {'volume'} (7d) {sortedColumn === SORT_FIELD.VOL_7DAYS ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText
                area="fees"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.FEES)
                  setSortDirection(sortedColumn !== SORT_FIELD.FEES ? true : !sortDirection)
                }}
              >
                {t('fees24hrs')} {sortedColumn === SORT_FIELD.FEES ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" justifyContent="flexEnd">
              <ClickableText
                area="apy"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.APY)
                  setSortDirection(sortedColumn !== SORT_FIELD.APY ? true : !sortDirection)
                }}
              >
                {`1y ${t('fees')} / ${t('liquidity')} ${
                  sortedColumn === SORT_FIELD.APY ? (!sortDirection ? '↑' : '↓') : ''
                }`}
                {sortedColumn === SORT_FIELD.APY ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
              <QuestionHelper text={t('basedOn24hrVolume')} />
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      </Panel>
      <PageButtons>
        <div
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{`${t('page')} ${page} ${t('of')} ${maxPage}`}</TYPE.body>
        <div
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </div>
  )
}

export default PairList
