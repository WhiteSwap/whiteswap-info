import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ButtonLight, ButtonFaded } from '../ButtonStyled'
import { AutoRow, RowBetween } from '../Row'
import { isAddress } from '../../utils'
import { useSavedAccounts } from '../../contexts/LocalStorage'
import { AutoColumn } from '../Column'
import { TYPE } from '../../Theme'
import { Hover, StyledIcon } from '..'
import Panel from '../Panel'
import { Divider } from '..'
import { Flex } from 'rebass'

import { X } from 'react-feather'
import { useMedia } from 'react-use'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border-radius: 12px;
`

const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  padding: .875rem 1rem;
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  font-size: 16px;
  margin-right: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const AccountLink = styled.span`
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => theme.link};
  font-size: 14px;
  font-weight: 500;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  grid-template-areas: 'account';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }
`

function AccountSearch({ history, small }) {
  const { t } = useTranslation()
  const [accountValue, setAccountValue] = useState()
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const below440 = useMedia('(max-width: 440px)')

  function handleAccountSearch() {
    if (isAddress(accountValue)) {
      history.push('/account/' + accountValue)
      if (!savedAccounts.includes(accountValue)) {
        addAccount(accountValue)
      }
    }
  }

  return (
    <AutoColumn gap={'1rem'}>
      {!small && (
        <AutoRow style={below440 ? { flexDirection: 'column' } : {}}>
          <Wrapper>
            <Input
              style={below440 ? { marginRight: '0px' } : {}}
              placeholder="0x..."
              onChange={(e) => {
                setAccountValue(e.target.value)
              }}
            />
          </Wrapper>
          <ButtonLight 
            style={below440 ? { width: '100%', marginTop: '1rem' } : {}}
            onClick={handleAccountSearch}
          >
            {t('loadAccountDetails')}
          </ButtonLight>
        </AutoRow>
      )}

      <AutoColumn gap={'12px'}>
        {!small && (
          <Panel>
            <DashGrid center={true} style={{ height: 'fit-content', padding: '0 0 1rem 0' }}>
              <TYPE.main area="account">{t('savedAccounts')}</TYPE.main>
            </DashGrid>
            <Divider />
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account) => {
                return (
                  <DashGrid key={account} center={true} style={{ height: 'fit-content', padding: '1rem 0 0 0' }}>
                    <Flex
                      area="account"
                      justifyContent="space-between"
                      onClick={() => history.push('/account/' + account)}
                    >
                      <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      <Hover onClick={() => removeAccount(account)}>
                        <StyledIcon>
                          <X size={16} />
                        </StyledIcon>
                      </Hover>
                    </Flex>
                  </DashGrid>
                )
              })
            ) : (
              <TYPE.light style={{ marginTop: '1rem' }}>{t('noSavedAccounts')}</TYPE.light>
            )}
          </Panel>
        )}

        {small && (
          <>
            <TYPE.main>{t('accounts')}</TYPE.main>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account) => {
                return (
                  <RowBetween key={account}>
                    <ButtonFaded onClick={() => history.push('/account/' + account)}>
                      {small ? (
                        <TYPE.header>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
                      ) : (
                        <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      )}
                    </ButtonFaded>
                    <Hover onClick={() => removeAccount(account)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
            ) : (
              <TYPE.light>{t('noPinnedWallets')}</TYPE.light>
            )}
          </>
        )}
      </AutoColumn>
    </AutoColumn>
  )
}

export default withRouter(AccountSearch)
