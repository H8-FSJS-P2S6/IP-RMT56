import axios from "axios";

const serverURL = import.meta.env.VITE_API_URL;
export const baseURLApi = axios.create({
  baseURL: serverURL,
});
