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
  );
};

export default Statistics;
