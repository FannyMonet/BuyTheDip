import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { fetchPutOrder } from "./orders";

interface PriceFormProps {
  setReloadId: (fn: (a: number) => number) => void;
}

const PriceForm: React.FC<PriceFormProps> = ({ setReloadId }) => {
  const [price, setPrice] = useState<number | null>(null);
  const { token } = useAppContext();
  const addOrder = (price: number) =>
    fetchPutOrder(token)(price).then(() => {
      setReloadId((n) => n + 1);
      setPrice(0);
    });

  return (
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
  );
};
export default PriceForm;
