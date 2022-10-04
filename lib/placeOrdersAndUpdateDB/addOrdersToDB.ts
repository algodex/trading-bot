import convertToDBObject from "../convertToDBObject";
import { Order } from "../types/order";

interface ValidResult {
  contract: Order;
}

const addOrdersToDB = async (escrowDB: any, validResults: ValidResult[]) => {
  const ordersAddToDB = validResults
    .filter((order) => order.contract.amount > 0)
    .map((order) => {
      return escrowDB.put({
        _id: order.contract.escrowAddr,
        order: convertToDBObject(order.contract),
      });
    });
  //     .filter((order) => order[0].contract.amount > 0)
  //     .map((order) => {
  //       return escrowDB.put({
  //         _id: order[0].contract.escrow,
  //         order: convertToDBObject(order[0]),
  //       });
  //     });
  return await Promise.all(ordersAddToDB).catch((e) => {
    console.error(e);
  });
};

export default addOrdersToDB;
