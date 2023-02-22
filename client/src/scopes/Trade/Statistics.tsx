import { List, ListItem, Paper, Stack, TextField } from "@mui/material";
import React from "react";
import { useStatistics } from "./statisticsHook";
import { Order } from "./Trade";

interface StatisticsProps {
  orders: Order[];
}
const Statistics: React.FC<StatisticsProps> = ({ orders }) => {
  const {
    ordersAveragePrice,
    sumGroupByUser,
    sumExpiredAt,
    expirationDate,
    setExpirationDate,
  } = useStatistics(orders);
  return (
    <Paper sx={{ background: "#e2e2e2", p: 3 }}>
      <Stack>
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Expiration date"
          variant="outlined"
          type="date"
          value={expirationDate ?? ""}
          onChange={({ target: { value } }) => setExpirationDate(value)}
        ></TextField>
        <p>
          Sum of the item which expire at {expirationDate}: {sumExpiredAt}
        </p>
        <p>Average price: {ordersAveragePrice}</p>
        <p>Sums by users:</p>
        <List>
          {sumGroupByUser.map(([username, sum]) => (
            <ListItem key={username} divider>{`${username}: ${sum}`}</ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
};

export default Statistics;
