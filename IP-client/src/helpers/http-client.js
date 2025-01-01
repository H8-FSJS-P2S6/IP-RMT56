import axios from "axios";

export const baseURLApi = axios.create({
  baseURL: "http://localhost:3000",
});
