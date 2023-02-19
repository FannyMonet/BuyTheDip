import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { fetchDeleteOrder, fetchPostOrder } from "./orders";
import { Order } from "./Trade";

interface PricesTableProps {
  orders: Order[];
  setReloadId: (fn: (a: number) => number) => void;
}
const PricesTable: React.FC<PricesTableProps> = ({ orders, setReloadId }) => {
  const { username, token } = useAppContext();
  const [editPrice, setEditPrice] = useState<{
    price: number;
    id: string;
  } | null>(null);
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
                      value={editPrice?.id === id ? editPrice?.price ?? 0 : 0}
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
  );
};

export default PricesTable;
