import { createContext, useEffect, useState } from "react";
import socket from "../services/socket";
import useAuth from "../hooks/useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(
    () => Boolean(socket.connected)
  );

  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect();
      }
      setIsConnected(false);
      return;
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;