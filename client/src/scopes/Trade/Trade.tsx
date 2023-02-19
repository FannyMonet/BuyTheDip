import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import {
  fetchDeleteOrder,
  fetchGetOrder,
  fetchPostOrder,
  fetchPutOrder,
} from "./orders";
import { useStatistics } from "./statistics";
import "./Trade.css";
export type Order = {
  id: string;
  price: number;
  expirationDate: string;
  username: string;
};
export default function Trade() {
  const [reloadId, setReloadId] = useState(0);
  const { token, username } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<{
    price: number;
    id: string;
  } | null>(null);

  const {
    ordersAveragePrice,
    sumGroupByUser,
    sumExpiredAt,
    expirationDate,
    setExpirationDate,
  } = useStatistics(orders);

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

  const addOrder = (price: number) =>
    fetchPutOrder(token)(price).then(() => {
      setReloadId((n) => n + 1);
      setPrice(0);
    });
  const editOrder = (id: string, price: number) =>
    fetchPostOrder(token)(id, price).then(() => {
      setReloadId((n) => n + 1);
      setEditPrice(null);
    });
  const deleteOrder = (id: string) =>
    fetchDeleteOrder(token)(id).then(() => {
      setReloadId((n) => n + 1);
    });

  return (
    <div className="Trade">
      <div className="table">
        <div className="control">
          <label htmlFor="price">
            Price
            <input
              type="number"
              id="price"
              value={price ?? 0}
              onChange={({ target: { value } }) => {
                const newPrice = parseInt(value);
                if (!Number.isNaN(newPrice)) {
                  setPrice(newPrice);
                }
              }}
            ></input>
          </label>
          <button
            onClick={() => {
              if (price !== null && price !== 0) {
                addOrder(price);
              }
            }}
          >{`Ajouter une option d'achat`}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>username</th>
              <th>price</th>
              <th>expiration</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(
              ({ username: orderUsername, id, price, expirationDate }) => (
                <tr key={id}>
                  <td>{orderUsername}</td>
                  <td>{price}</td>
                  <td>{new Date(expirationDate).toDateString()}</td>
                  <td>
                    {orderUsername === username && (
                      <>
                        <input
                          type="number"
                          id={`edit-price-${id}`}
                          value={
                            editPrice?.id === id ? editPrice?.price ?? 0 : 0
                          }
                          onChange={({ target: { value } }) => {
                            const newPrice = parseInt(value);
                            if (!Number.isNaN(newPrice)) {
                              setEditPrice({ price: newPrice, id });
                            }
                          }}
                        ></input>
                        <button
                          onClick={() => {
                            if (editPrice && editPrice.id === id) {
                              editOrder(editPrice.id, editPrice.price);
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteOrder(id);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="stats">
        <label>Expiration date</label>
        <input
          type="date"
          value={expirationDate ?? ""}
          onChange={({ target: { value } }) => setExpirationDate(value)}
        ></input>
        <p>
          Sum of the item which expire at {expirationDate}: {sumExpiredAt}
        </p>
        <p>Average price: {ordersAveragePrice}</p>
        <p>Sums by users:</p>
        <ul>
          {sumGroupByUser.map(([username, sum]) => (
            <li key={username}>{`${username}: ${sum}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
