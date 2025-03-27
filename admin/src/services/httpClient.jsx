import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `JWT ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const res = await client.post("admin/refresh-token", {
      refreshToken,
    });
    localStorage.setItem("Access_Token", res.data.accessToken);
    localStorage.setItem("Refresh_Token", res.data.refreshToken);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 23);
    localStorage.setItem("Auth_Expiration", expiration.toISOString());
    return res.data.accessToken;
  } catch (error) {
    console.log("Token refresh failed: ", error);
    return null;
  }
};

const checkToken = async () => {
  let token = localStorage.getItem("Access_Token");
  const storedRefreshToken = localStorage.getItem("Refresh_Token");
  const expiration = localStorage.getItem("Auth_Expiration");
  if (!token) {
    if (!storedRefreshToken) {
      throw new Error("User is not authenticated");
    }
    console.log("Refreshing token...");
    token = await refreshToken(storedRefreshToken);
  }

  if (expiration && new Date(expiration) < new Date()) {
    if (!storedRefreshToken) {
      throw new Error("No refresh token");
    }
    console.log("Token expired. Refreshing token...");
    token = await refreshToken(storedRefreshToken);
  }
  if (!token) {
    throw new Error("Token refresh failed");
  }
  return token;
};

export { client, refreshToken, checkToken, setAuthToken };
