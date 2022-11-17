import initAPI from './initAPI';
import { Environment } from './types/config';
import initWallet from './initWallet';

export const cancelAssetOrders = async (
  wallet: any,
  assetId: number,
  environment: Environment
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
      algodexApi.closeOrder(order);
    })
  );
  //   console.log(openAssetOrders);
  return openAssetOrders;
};
