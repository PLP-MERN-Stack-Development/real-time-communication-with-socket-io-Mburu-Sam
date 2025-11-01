import { useState, useEffect } from "react";
import { socket } from "../socket/socket";

export default function MessageInput({ activeChat, username }) {
  const [text, setText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  function sendMessage() {
    if (!text.trim()) return;
    
    if (activeChat === "global") {
      socket.emit("send_message", { message: text });
    } else {
      socket.emit("private_message", { to: activeChat, message: text });
    }
    
    socket.emit("typing", false);
    setText("");
  }

  function handleTyping(e) {
    setText(e.target.value);
    
    // Clear existing timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set typing indicator
    socket.emit("typing", true);
    
    // Clear typing indicator after 1 second of no typing
    const timeout = setTimeout(() => {
      socket.emit("typing", false);
    }, 1000);
    
    setTypingTimeout(timeout);
  }

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  return (
    <div className="flex p-3 bg-gray-200 rounded mt-2">
      <input
        className="flex-1 p-2 rounded border"
        placeholder="Type message..."
        value={text}
        onChange={handleTyping}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="ml-2 px-4 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
