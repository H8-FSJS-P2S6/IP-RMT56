import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "http://54.235.46.174/",
});

export default instance;
