import { useEffect, useState, useCallback } from "react";
import { socket } from "../socket/socket";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Chat({ username }) {
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState("global");
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Handle notifications
  const showNotification = useCallback((title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }, []);

  useEffect(() => {
    // Handle user list updates
    socket.on("user_list", (userList) => {
      setUsers(userList.filter(u => u.username !== username));
    });

    // Handle user join/leave events
    socket.on("user_joined", (user) => {
      showNotification("User Joined", `${user.username} joined the chat`);
    });

    socket.on("user_left", (user) => {
      showNotification("User Left", `${user.username} left the chat`);
    });

    // Handle typing indicators
    socket.on("typing_users", (users) => {
      setTypingUsers(users);
    });

    // Handle private messages
    socket.on("private_message", (message) => {
      if (activeChat !== message.senderId) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
        showNotification("New Private Message", `${message.sender}: ${message.message}`);
      }
    });

    // Handle global messages
    socket.on("receive_message", (message) => {
      if (activeChat !== "global") {
        setUnreadCounts(prev => ({
          ...prev,
          global: (prev.global || 0) + 1
        }));
        showNotification("New Message", `${message.sender}: ${message.message}`);
      }
    });

    return () => {
      socket.off("user_list");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("typing_users");
      socket.off("private_message");
      socket.off("receive_message");
    };
  }, [username, activeChat, showNotification]);

  // Clear unread count when changing chats
  const handleChatChange = (chatId) => {
    setActiveChat(chatId);
    setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/4 bg-white border-r p-4">
        {/* Global Chat */}
        <div 
          className={`p-4 mb-4 cursor-pointer rounded-lg ${
            activeChat === "global" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => handleChatChange("global")}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Global Chat</h3>
            {unreadCounts.global > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {unreadCounts.global}
              </span>
            )}
          </div>
        </div>

        {/* Online Users */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Online Users</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeChat === user.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleChatChange(user.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>{user.username}</span>
                  </div>
                  {unreadCounts[user.id] > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      {unreadCounts[user.id]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activeChat === "global" ? "Global Chat" : `Chat with ${users.find(u => u.id === activeChat)?.username}`}
          </h2>
          {typingUsers.length > 0 && (
            <p className="text-gray-500 italic">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </p>
          )}
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <MessageList
            username={username}
            activeChat={activeChat}
          />
          <MessageInput
            activeChat={activeChat}
            username={username}
          />
        </div>
      </main>
    </div>
  );
}
