import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket/socket'
import Login from "./pages/Login";
import Chat from "./pages/Chat";

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isConnected, setIsConnected] = useState(false);

  const handleLogin = (newUsername) => {
    localStorage.setItem("username", newUsername);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    socket.disconnect();
    localStorage.removeItem("username");
    setUsername(null);
  };

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => {
      setIsConnected(false);
      // Optional: Automatically try to reconnect
      setTimeout(() => {
        if (username && !socket.connected) {
          socket.connect();
          socket.emit("user_join", username);
        }
      }, 5000);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Try to auto-connect if we have a username
    if (username && !socket.connected) {
      socket.connect();
      socket.emit("user_join", username);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [username]);

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {!isConnected && (
        <div className="bg-yellow-100 p-2 text-center">
          <p className="text-yellow-800">
            Connecting to server...
          </p>
        </div>
      )}
      
      <div className="flex-1">
        <Chat 
          username={username} 
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
