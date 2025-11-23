  import { BASE_URL } from "../api/api";

  export const formatUrl = (url) => {
    if (!url) return null;
    if (Array.isArray(url)) url = url[0];
    if (typeof url === "object") return "";
    url = String(url);

    return url.startsWith("http")
      ? url
      : `${BASE_URL.replace(/\/$/, "")}${url}`;
  };
