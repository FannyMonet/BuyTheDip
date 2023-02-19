import { useMemo, useState } from "react";
import { Order } from "./Trade";

type UseStatistics = (
  orders: Order[]
) => {
  sumGroupByUser: [string, number][];
  ordersAveragePrice: number;
  sumExpiredAt: number;
  expirationDate: string | null;
  setExpirationDate: (date: string) => void;
};

export const useStatistics: UseStatistics = (orders) => {
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const ordersAveragePrice = useMemo(
    () => orders.reduce((sum, { price }) => sum + price, 0) / orders.length,
    [orders]
  );

  const sumGroupByUser = useMemo(
    () =>
      Object.entries(
        orders.reduce<Record<string, number>>((sumByUser, order) => {
          return {
            ...sumByUser,
            [order.username]: sumByUser.hasOwnProperty(order.username)
              ? sumByUser[order.username]
              : 0 + order.price,
          };
        }, {})
      ).sort(([, prevPrice], [, nextPrice]) => nextPrice - prevPrice),
    [orders]
  );

  const sumExpiredAt = useMemo(
    () =>
      expirationDate === null
        ? 0
        : orders
            .filter(
              ({ expirationDate: date }) =>
                new Date(expirationDate).getTime() > new Date(date).getTime()
            )
            .reduce((sum, order) => sum + order.price, 0),
    [expirationDate]
  );

  return {
    sumGroupByUser,
    ordersAveragePrice,
    sumExpiredAt,
    expirationDate,
    setExpirationDate,
  };
};
