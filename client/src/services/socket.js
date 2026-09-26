import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_BACKEND_URL || "https://servigo-localservice-marketplace.onrender.com";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  auth: (cb) => {
    const token =
      localStorage.getItem("servigo_token") || localStorage.getItem("token");
    cb({ token });
  },
});

export default socket;