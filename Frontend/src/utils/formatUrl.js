import { BASE_URL } from "../api/api";

export const formatUrl = (url) =>
  url?.startsWith("http")
    ? url
    : `${BASE_URL.replace(/\/$/, "")}${url}`;
