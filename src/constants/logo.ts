import { SupportedNetwork } from './networks'

export type LogoUrls = Record<SupportedNetwork, string>
export type OverrideUrls = Record<SupportedNetwork, Record<string, string>>

export const LOGO_SOURCE: LogoUrls = {
  [SupportedNetwork.ETHEREUM]:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets',
  [SupportedNetwork.POLYGON]:
    'https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/55cf373d3a447fa52c0f9edd482a20c077b353d2/assets/tokenAssets',
  [SupportedNetwork.POLYGON_ZKEVM]:
    'https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/55cf373d3a447fa52c0f9edd482a20c077b353d2/assets/tokenAssets',
  [SupportedNetwork.WHITECHAIN]: '',
  [SupportedNetwork.TRON]: 'https://coin.top/production/upload/logo'
}

export const WSD_LOGO = 'https://cdn.whitebit.com/currencies_icon/08f1494b-a813-43c9-84d8-43ea50e45417.png'

// use lowercase
export const LOGO_OVERRIDES: OverrideUrls = {
  [SupportedNetwork.ETHEREUM]: {
    '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb': `${LOGO_SOURCE.ethereum}/0x42456D7084eacF4083f1140d3229471bbA2949A8/logo.png`,
    '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': `${LOGO_SOURCE.ethereum}/0xC011A72400E58ecD99Ee497CF89E3775d4bd732F/logo.png`,
    '0x77b8ae2e83c7d044d159878445841e2a9777af38':
      'https://coin.top/production/upload/logo/THV4MnqnGk77YRDe3SPGzqFqC21cCjH2Fu.png',
    '0x0423d7c27d1dde7eb4aae02dae6b651c7225e6f9': WSD_LOGO,
    '0x925206b8a707096ed26ae47c84747fe0bb734f59':
      'https://assets.coingecko.com/coins/images/27045/small/WBT_250x250px.png'
  },
  [SupportedNetwork.POLYGON]: {
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270':
      'https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/55cf373d3a447fa52c0f9edd482a20c077b353d2/assets/tokenAssets/matic.svg',
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f':
      'https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/55cf373d3a447fa52c0f9edd482a20c077b353d2/assets/tokenAssets/usdt.svg',
    '0xf3443e91b2ea741a49bb7d060037f11786407f4e': WSD_LOGO
  },
  [SupportedNetwork.WHITECHAIN]: {
    '0xb044a2a1e3c3deb17e3602bf088811d9bdc762ea':
      'https://assets.coingecko.com/coins/images/27045/small/WBT_250x250px.png?1663654854',
    '0xf97b9bf62916f1eb42dd906a7254603e7b9fc4a7':
      'https://cdn.whitebit.com/currencies_icon/484c5cf2-2c4d-48a6-b885-aaec5e98b975.png'
  },
  [SupportedNetwork.POLYGON_ZKEVM]: {
    '0x1e4a5963abfd975d8c9021ce480b42188849d41d':
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    '0x4374a0d2b27e61260acc9868d4a12daa80ce0de2': WSD_LOGO,
    '0xa2036f0538221a77a3937f1379699f44945018d0':
      'https://zkevm.polygonscan.com/assets/zkpoly/images/svg/logos/token-secondary-dim.svg?v=24.6.1.1',
    '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9': 'https://zkevm.polygonscan.com/token/images/wrappedeth_ofc_32.png'
  },
  [SupportedNetwork.TRON]: {
    tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/logo.png',
    tfptbwaarrwtx5yvy3gng5lm8bmhpx82bt: 'https://assets.coingecko.com/coins/images/27045/small/WBT_250x250px.png',
    thv4mnqngk77yrde3spgzqfqc21ccjh2fu: WSD_LOGO
  }
}
