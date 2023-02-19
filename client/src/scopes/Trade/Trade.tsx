import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import "./Trade.css";
type Order = {
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

  useEffect(() => {
    fetch("http://localhost:8080/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const orders = (res.body.orders as Order[]).sort(
          (prev, next) =>
            new Date(prev.expirationDate).getTime() -
            new Date(next.expirationDate).getTime()
        );
        setOrders(orders);
      });
  }, [reloadId]);

  const addOrder = (price: number) =>
    fetch("http://localhost:8080/orders", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price }),
    }).then(() => {
      setReloadId((n) => n + 1);
      setPrice(0);
    });
  const editOrder = (id: string, price: number) =>
    fetch(`http://localhost:8080/orders/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price }),
    }).then(() => {
      setReloadId((n) => n + 1);
      setEditPrice(null);
    });
  const deleteOrder = (id: string) =>
    fetch(`http://localhost:8080/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(() => {
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
      <div className="stats"></div>
    </div>
  );
}
