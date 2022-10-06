import { Order } from "../types/order";

const waitForOrders = async (ordersToPlace: any[]) => {
  const results = await Promise.all(
    ordersToPlace.map((p) => p.catch((e:any) => e))
  );
  const validResults = results.filter((result:any) => !(result instanceof Error));
  const invalidResults = results.filter((result:any) => result instanceof Error);
  if (invalidResults && invalidResults.length > 0) {
    console.error({ invalidResults });
  }
  return { validResults, invalidResults };
};

export default waitForOrders;
