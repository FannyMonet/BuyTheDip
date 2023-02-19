import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { fetchGetOrder } from "./orders";
import "./Trade.css";
import Statistics from "./Statistics";
import PricesTable from "./PricesTable";
import PriceForm from "./PriceForm";
export type Order = {
  id: string;
  price: number;
  expirationDate: string;
  username: string;
};
export default function Trade() {
  const [reloadId, setReloadId] = useState(0);
  const { token } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchGetOrder(token).then((res) => {
      const orders = res.sort(
        (prev, next) =>
          new Date(prev.expirationDate).getTime() -
          new Date(next.expirationDate).getTime()
      );
      setOrders(orders);
    });
  }, [reloadId]);

  return (
    <div className="Trade">
      <div className="table">
        <PriceForm setReloadId={setReloadId} />
        <PricesTable orders={orders} setReloadId={setReloadId} />
      </div>
      <Statistics orders={orders} />
    </div>
  );
}
