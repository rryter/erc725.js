import HttpProvider from 'web3-providers-http';
import { AbstractProvider as EthersProvider } from 'ethers';

export const enum ProviderTypes {
  ETHEREUM = 'ETHEREUM',
  WEB3 = 'WEB3',
  ETHERS = 'ETHERS',
}

export type EthereumProvider = { request: any };
export type ERC725Provider = EthersProvider | HttpProvider | EthereumProvider;
