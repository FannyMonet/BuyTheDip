import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import "./Trade.css";

export default function Trade() {
  const [reloadId, setReloadId] = useState(0);
  const { token } = useAppContext();
  const [orders, setOrders] = useState<
    { id: string; price: number; expirationDate: Date; username: string }[]
  >([]);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const orders = res.body.orders;
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
            </tr>
          </thead>
          <tbody>
            {orders.map(({ username, id, price, expirationDate }) => (
              <tr key={id}>
                <td>{username}</td>
                <td>{price}</td>
                <td>{new Date(expirationDate).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="stats"></div>
    </div>
  );
}
