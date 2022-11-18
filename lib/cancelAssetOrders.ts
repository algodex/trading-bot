import initAPI from './initAPI';
import { Environment } from './types/config';
import initWallet from './initWallet';

type Wallet = {
    address: string,
    mnemonic: string
}

export const cancelAssetOrders = async (
  wallet: Wallet,
  assetId: number,
  environment: Environment,
  callbackFn: (message:string )=> void
) => {
  const algodexApi = initAPI(environment);
  await initWallet(algodexApi, wallet.address, wallet.mnemonic);
  console.log(algodexApi.wallet);
  const orders = await algodexApi.http.dexd.fetchOrders(
    'wallet',
    wallet.address
  );
  console.log(orders);
  const openAssetOrders = orders.filter(
    (order: any) => order.asset.id === assetId
  );

  const mappedOpenAssetOrders = openAssetOrders.map((order: any) => {
    return { ...order, wallet: algodexApi.wallet };
  });

  await Promise.all(
    mappedOpenAssetOrders.map((order: any) => {
      algodexApi.closeOrder(order, callbackFn);
    })
  );
  //   console.log(openAssetOrders);
  return openAssetOrders;
};
