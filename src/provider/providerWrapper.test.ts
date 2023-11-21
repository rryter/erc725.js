// eslint-disable-next-line import/no-extraneous-dependencies
import { anything, instance, mock, when } from 'ts-mockito';
import HttpProvider from 'web3-providers-http';
import { ProviderWrapper } from './providerWrapper';

const erc725AccountAddress = '0x214be121bB52e6909c5158579b3458f8760f1b2f';
const defaultGas = 1_000_000;

// Creating mock
const MockedHttpProvider: HttpProvider = mock(HttpProvider);

function mockHttpProvider(callBackValue) {
  when(MockedHttpProvider.send(anything(), anything())).thenCall(callBackValue);

  return instance(MockedHttpProvider);
}

describe('ProviderWrapper', () => {
  describe('#getOwner', () => {
    it('should return an address', async () => {
      const mockedHttpProvider: HttpProvider = mockHttpProvider(
        (_payload, cb) => {
          cb(null, {
            result:
              '0x000000000000000000000000a78e0e7c9b1b36f7e25c5ccdfdba005ec37eadf4',
          });
        },
      );

      const ethSource = new ProviderWrapper(mockedHttpProvider, defaultGas);

      const owner = await ethSource.getOwner(erc725AccountAddress);
      expect(owner).toStrictEqual('0xA78E0E7C9b1B36F7E25C5CcDfdbA005Ec37eadf4');
    });

    it('should throw when promise was rejected', async () => {
      const mockedHttpProvider: HttpProvider = mockHttpProvider(
        (_payload, cb) => {
          cb(new Error('some error'));
        },
      );

      const ethSource = new ProviderWrapper(mockedHttpProvider, defaultGas);

      try {
        await ethSource.getOwner(erc725AccountAddress);
      } catch (error: any) {
        expect(error.message).toEqual('some error');
      }
    });

    it('should throw when promise returned error', async () => {
      const mockedHttpProvider: HttpProvider = mockHttpProvider(
        (_payload, cb) => {
          cb(null, {
            error: new Error('some error'),
          });
        },
      );

      const ethSource = new ProviderWrapper(mockedHttpProvider, defaultGas);

      try {
        await ethSource.getOwner(erc725AccountAddress);
      } catch (error: any) {
        expect(error.message).toEqual('some error');
      }
    });
  });
});
