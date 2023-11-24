import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import { Area, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, AreaChart } from 'recharts'
import styled from 'styled-components'
import { toK, toNiceDate, toNiceDateYear } from 'utils'

const ChartWrapper = styled.div`
  padding-top: 1em;
  margin-left: -1.5em;
  @media (max-width: 40em) {
    margin-left: -1em;
  }
`
const tooltipContainerStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  borderColor: 'var(--c-zircon)'
}

const Chart = ({ data, chartOption, currencyUnit, symbol }) => {
  const { t } = useTranslation()
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    setChartData([])
    setChartData(data)
  }, [data, chartOption, currencyUnit])

  const isMobile = useMedia('(max-width: 40em)')
  if (chartOption === 'price' && chartData && data) {
    return (
      <ChartWrapper>
        <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
          <AreaChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              minTickGap={80}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="dayString"
            />
            <YAxis
              hide={isMobile}
              type="number"
              tickMargin={16}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={2}
            />
            <YAxis
              hide={true}
              type="number"
              tickMargin={16}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={3}
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={
                currencyUnit === 'ETH' ? `${t('price')} (ETH/` + symbol + ')' : `${t('price')} (USD/` + symbol + ')'
              }
              dataKey={currencyUnit === 'ETH' ? 'ethPerToken' : 'tokenPriceUSD'}
              yAxisId={2}
              fill="var(--c-token)"
              opacity={'0.4'}
              stroke="var(--c-token)"
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={
                currencyUnit === 'USD' ? `${t('inverse')} (` + symbol + '/USD)' : `${t('inverse')} (` + symbol + '/ETH)'
              }
              dataKey={currencyUnit === 'USD' ? 'tokensPerUSD' : 'tokensPerEth'}
              yAxisId={3}
              fill="var(--c-token)"
              opacity={'0'}
              stroke="var(--c-token)"
            />
            <Tooltip
              cursor={true}
              formatter={value => toK(value, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={tooltipContainerStyle}
              wrapperStyle={{ top: -70, left: -10 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    )
  }
  return chartOption !== 'volume' && chartData && data ? (
    <ChartWrapper>
      <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
        <AreaChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            tickLine={false}
            axisLine={false}
            interval="preserveEnd"
            tickMargin={14}
            minTickGap={80}
            tickFormatter={tick => toNiceDate(tick)}
            dataKey="dayString"
          />
          <YAxis
            hide={isMobile}
            type="number"
            tickMargin={16}
            orientation="left"
            tickFormatter={tick => toK(tick)}
            axisLine={false}
            tickLine={false}
            interval="preserveEnd"
            minTickGap={80}
            yAxisId={0}
          />
          <YAxis
            hide={true}
            type="number"
            tickMargin={16}
            orientation="right"
            tickFormatter={tick => toK(tick)}
            axisLine={false}
            tickLine={false}
            interval="preserveEnd"
            minTickGap={80}
            yAxisId={1}
          />
          <Tooltip
            cursor={true}
            formatter={value => toK(value, true)}
            labelFormatter={label => toNiceDateYear(label)}
            labelStyle={{ paddingTop: 4 }}
            contentStyle={tooltipContainerStyle}
            wrapperStyle={{ top: -70, left: -10 }}
          />
          <Area
            strokeWidth={2}
            dot={false}
            type="monotone"
            name={t('totalLiquidity') + (currencyUnit === 'USD' ? ' (USD)' : ' (ETH)')}
            dataKey={currencyUnit === 'USD' ? 'usdLiquidity' : 'ethLiquidity'}
            yAxisId={0}
            fill="var(--c-token)"
            opacity={'0.4'}
            stroke="var(--c-token)"
          />
          <Area
            type="monotone"
            name={`Eth ${t('balance')}`}
            dataKey={'ethBalance'}
            fill="var(--c-token)"
            opacity={'0'}
            stroke="var(--c-token)"
          />
          <Area
            type="monotone"
            name={`Token ${t('balance')}`}
            dataKey={'tokenBalance'}
            fill="var(--c-token)"
            yAxisId={1}
            opacity={'0'}
            stroke="var(--c-token)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  ) : (
    <ChartWrapper>
      <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
        <BarChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            tickLine={false}
            axisLine={false}
            interval="preserveEnd"
            minTickGap={80}
            tickMargin={14}
            tickFormatter={tick => toNiceDate(tick)}
            dataKey="dayString"
          />
          <YAxis
            hide={isMobile}
            type="number"
            axisLine={false}
            tickMargin={16}
            tickFormatter={tick => toK(tick)}
            tickLine={false}
            interval="preserveEnd"
            minTickGap={80}
            yAxisId={0}
          />
          <Tooltip
            cursor={true}
            formatter={value => toK(value, true)}
            labelFormatter={label => toNiceDateYear(label)}
            labelStyle={{ paddingTop: 4 }}
            contentStyle={tooltipContainerStyle}
            wrapperStyle={{ top: -70, left: -10 }}
          />
          <Bar
            type="monotone"
            name={t('volume') + (currencyUnit === 'USD' ? ' (USD)' : ' (ETH)')}
            dataKey={currencyUnit === 'USD' ? 'usdVolume' : 'ethVolume'}
            fill="var(--c-token)"
            opacity={'0.4'}
            yAxisId={0}
            stroke="var(--c-token)"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default Chart
