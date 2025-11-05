// https://slack-clone-one-sepia.vercel.app/

import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://slack-clone-one-sepia.vercel.app";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
