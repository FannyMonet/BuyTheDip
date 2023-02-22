import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { fetchDeleteOrder, fetchPostOrder } from "./orders";
import { Order } from "./Trade";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Username</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Expiration</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(
            ({ id, username: orderUsername, price, expirationDate }) => (
              <TableRow
                key={id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{orderUsername}</TableCell>
                <TableCell align="left">{price}</TableCell>
                <TableCell align="left">
                  {new Date(expirationDate).toDateString()}
                </TableCell>
                <TableCell align="left">
                  {orderUsername === username && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TextField
                        label="Edit price"
                        type="number"
                        value={editPrice?.id === id ? editPrice?.price ?? 0 : 0}
                        onChange={({ target: { value } }) => {
                          const newPrice = parseInt(value);
                          if (!Number.isNaN(newPrice)) {
                            setEditPrice({ price: newPrice, id });
                          }
                        }}
                      ></TextField>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (editPrice && editPrice.id === id) {
                            editOrder(editPrice.id, editPrice.price);
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          deleteOrder(id);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PricesTable;
