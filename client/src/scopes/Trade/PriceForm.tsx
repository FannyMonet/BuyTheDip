import { Button, Stack, TextField } from "@mui/material";
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
    <Stack direction="row" justifyContent="space-between">
      <TextField
        label="Price"
        type="number"
        value={price ?? 0}
        onChange={({ target: { value } }) => {
          const newPrice = parseInt(value);
          if (!Number.isNaN(newPrice)) {
            setPrice(newPrice);
          }
        }}
      ></TextField>
      <Button
        variant="outlined"
        onClick={() => {
          if (price !== null && price !== 0) {
            addOrder(price);
          }
        }}
      >{`Ajouter une option d'achat`}</Button>
    </Stack>
  );
};
export default PriceForm;
