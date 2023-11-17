/*
    This file is part of @erc725/erc725.js.
    @erc725/erc725.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    @erc725/erc725.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with @erc725/erc725.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { AbiCoder } from 'ethers';
import { METHODS } from '../constants/constants';
import {
  JsonRpc,
  JsonRpcEthereumProviderParamsWithLatest,
} from '../types/JsonRpc';
import { Method } from '../types/Method';

let idCount = 0;
const abiCoder = new AbiCoder();

export function decodeResult(method: Method, hexString: string) {
  if (hexString === '0x') {
    return null;
  }

  const decodedData = abiCoder.decode(
    [METHODS[method].returnEncoding],
    hexString,
  )[0];

  if (
    Array.isArray(decodedData) &&
    decodedData.length === 1 &&
    decodedData[0] === '0x'
  ) {
    return [null];
  }

  return decodedData;
}

const constructJSONRPCParams = (
  address: string,
  method: Method,
  gasInfo: number,
  methodParam?: string,
): JsonRpcEthereumProviderParamsWithLatest => {
  const data = methodParam
    ? METHODS[method].sig + methodParam.replace('0x', '')
    : METHODS[method].sig;

  return [
    {
      to: address,
      value: METHODS[method].value,
      gas: '0x' + gasInfo.toString(16),
      data,
    },
    'latest',
  ];
};

export function constructJSONRPC(
  address: string,
  method: Method,
  gasInfo: number,
  methodParam?: string,
): JsonRpc {
  idCount += 1;
  return {
    jsonrpc: '2.0',
    method: 'eth_call',
    params: constructJSONRPCParams(address, method, gasInfo, methodParam),
    id: idCount,
  };
}
