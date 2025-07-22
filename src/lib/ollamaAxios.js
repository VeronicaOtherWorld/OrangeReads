import axios from "axios";

const instance = axios.create({
  baseURL: "https://instantly-improved-pig.ngrok-free.app/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default instance;
