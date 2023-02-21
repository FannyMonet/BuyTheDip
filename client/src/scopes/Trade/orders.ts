import { serverHost } from "../../App";
import { Order } from "./Trade";

const headersWithAuth = (
  token: string | null,
  headers: Record<string, string> = {}
) => ({
  Authorization: `Bearer ${token ?? ""}`,
  ...headers,
});

export const fetchGetOrder = async (token: string | null): Promise<Order[]> =>
  fetch(`${serverHost}/orders`, {
    method: "GET",
    headers: headersWithAuth(token),
  })
    .then((res) => res.json())
    .then((res) => res.body?.orders);

export const fetchPutOrder = (token: string | null) => (price: number) =>
  fetch(`${serverHost}/orders`, {
    method: "PUT",
    headers: headersWithAuth(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ price }),
  });

export const fetchPostOrder = (token: string | null) => (
  id: string,
  price: number
) =>
  fetch(`${serverHost}/orders/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price }),
  });

export const fetchDeleteOrder = (token: string | null) => (id: string) =>
  fetch(`${serverHost}/orders/${id}`, {
    method: "DELETE",
    headers: headersWithAuth(token),
  });
