import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import { Divider } from 'components'
import DoubleTokenLogo from 'components/DoubleLogo'
import { CustomLink } from 'components/Link'
import Panel from 'components/Panel'
import { RowFixed } from 'components/Row'
import { useFormatPath } from 'hooks'
import { TYPE } from 'Theme'
import { ellipsisAddress, formattedNumber } from 'utils'
import { CustomText, DashGrid, DataText, List, ListWrapper, PageButtons, PaginationButton } from './styled'

interface ILPList {
  data: LiquidityPosition[]
  itemMax: number
}

interface ListItemProperties {
  data: LiquidityPosition
  index: number
}

const ListItem = ({ data, index }: ListItemProperties) => {
  const formatPath = useFormatPath()
  const below440 = useMedia('(max-width: 440px)')
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  return (
    <DashGrid style={{ padding: below440 ? '.75rem' : '.75rem 2rem' }}>
      {below600 ? undefined : <DataText fontWeight="500">{index}</DataText>}
      <DataText alignItems="center" justifyContent="flex-start">
        <CustomLink to={formatPath(`/accounts/${data.account}`)}>
          {below800 ? ellipsisAddress(data.account) : data.account}
        </CustomLink>
      </DataText>
      <DataText alignItems="center" justifyContent="flex-end">
        <CustomLink to={formatPath(`/pairs/${data.pair.id}`)}>
          <RowFixed style={{ textAlign: 'right' }}>
            {!below600 && (
              <DoubleTokenLogo
                a0={data.pair.tokenOne.id}
                a1={data.pair.tokenTwo.id}
                size={below600 ? 16 : 20}
                margin={true}
              />
            )}
            {data.pair.tokenOne.symbol}-{data.pair.tokenTwo.symbol}
          </RowFixed>
        </CustomLink>
      </DataText>
      <DataText alignItems="center" justifyContent="flex-end">
        {formattedNumber(data.amount, true)}
      </DataText>
    </DashGrid>
  )
}

function LPList({ data, itemMax = 10 }: ILPList) {
  const { t } = useTranslation()
  const below440 = useMedia('(max-width: 440px)')
  const below600 = useMedia('(max-width: 600px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)
  const paginatedList = data.slice(itemMax * (page - 1), page * itemMax)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)

    if (data) {
      let extraPages = 1
      if (data.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(data.length / itemMax) + extraPages)
    }
  }, [data])

  const incrementPage = () => {
    setPage(page === 1 ? page : page - 1)
  }

  const decrementPage = () => {
    setPage(page === maxPage ? page : page + 1)
  }

  return (
    <ListWrapper>
      <Panel
        style={{
          marginTop: below440 ? '.75rem' : '1.5rem',
          padding: 0
        }}
      >
        <DashGrid style={{ height: 'fit-content', borderTop: 'none' }}>
          {!below600 && (
            <Flex alignItems="center" justifyContent="flex-start">
              <CustomText>#</CustomText>
            </Flex>
          )}
          <Flex alignItems="center" justifyContent="flex-start">
            <CustomText>{t('account')}</CustomText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <CustomText>{t('pair')}</CustomText>
          </Flex>
          <Flex alignItems="center" justifyContent="flexEnd">
            <CustomText>{t('value')}</CustomText>
          </Flex>
        </DashGrid>
        <Divider />
        <List p={0}>
          {paginatedList.map((item, index) => (
            <ListItem key={`${item.account}-${item.pair.id}`} data={item} index={(page - 1) * itemMax + index + 1} />
          ))}
        </List>
      </Panel>
      {maxPage ? (
        <PageButtons>
          <PaginationButton type="button" disabled={page === 1} onClick={incrementPage}>
            <ArrowLeft width="1rem" height="1rem" />
          </PaginationButton>
          <TYPE.body>{t('pagination', { currentPage: page, maxPage })}</TYPE.body>
          <PaginationButton type="button" disabled={page === maxPage} onClick={decrementPage}>
            <ArrowRight width="1rem" height="1rem" />
          </PaginationButton>
        </PageButtons>
      ) : undefined}
    </ListWrapper>
  )
}

export default LPList
