import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { fetchGetOrder } from "./orders";
import Statistics from "./Statistics";
import PricesTable from "./PricesTable";
import PriceForm from "./PriceForm";
import { Container, Stack } from "@mui/material";
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
    <Container>
      <Stack direction="row" py={4} spacing={3}>
        <Stack flex={2}>
          <PriceForm setReloadId={setReloadId} />
          <PricesTable orders={orders} setReloadId={setReloadId} />
        </Stack>
        <Statistics orders={orders} />
      </Stack>
    </Container>
  );
}
