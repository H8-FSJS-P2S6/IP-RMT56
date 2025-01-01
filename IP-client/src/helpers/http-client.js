import axios from "axios";

export const baseURLApi = axios.create({
  baseURL: "https://localhost:3000",
});
