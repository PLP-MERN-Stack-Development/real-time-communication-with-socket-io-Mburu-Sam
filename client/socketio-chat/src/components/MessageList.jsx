import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";

export default function MessageList({ username, activeChat }) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load initial messages from the server
    fetch(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}/api/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for private messages
    socket.on("private_message", (message) => {
      if (message.senderId === activeChat || message.sender === username) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    // Listen for typing status
    socket.on("typing_users", (users) => {
      setTypingUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("private_message");
      socket.off("typing_users");
    };
  }, [username, activeChat]);

  return (
    <div className="flex flex-col p-4 h-[calc(100vh-16rem)] overflow-y-auto">
      {messages
        .filter(msg => 
          activeChat === "global" 
            ? !msg.isPrivate 
            : (msg.senderId === activeChat || msg.sender === username)
        )
        .map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === username
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {msg.system ? (
                <p className="text-gray-500 text-center italic text-sm">
                  {msg.message}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${
                      msg.sender === username ? "text-blue-100" : "text-gray-600"
                    }`}>
                      {msg.sender === username ? "You" : msg.sender}
                    </span>
                    <span className={`text-xs ${
                      msg.sender === username ? "text-blue-200" : "text-gray-400"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="break-words">{msg.message}</p>
                </>
              )}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
