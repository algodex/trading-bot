import initAPI from "./initAPI";
import { Environment } from "./types/config";
import initWallet from "./initWallet";

type Wallet = {
  address: string;
  mnemonic: string;
};

export const cancelAssetOrders = async (
  wallet: Wallet,
  assetId: number,
  environment: Environment
) => {
  const algodexApi = initAPI(environment);
  await initWallet(algodexApi, wallet.address, wallet.mnemonic);
  const orders = await algodexApi.http.dexd.fetchOrders(
    "wallet",
    wallet.address
  );
  const openAssetOrders = orders.filter(
    (order: any) => order.asset.id === assetId
  );

  const mappedOpenAssetOrders = openAssetOrders.map((order: any) => {
    return { ...order, wallet: algodexApi.wallet };
  });

   await Promise.all(
    mappedOpenAssetOrders.map((order: any) => {
     return algodexApi.closeOrder(order);
    })
  );
  return openAssetOrders;
};
