import { useState } from "react";
import { socket } from "../socket/socket";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Connect socket
      socket.connect();
      
      // Join chat
      socket.emit("user_join", username);
      
      // Listen for join confirmation
      socket.once("user_list", () => {
        // Successfully joined
        onLogin(username);
      });

      // Listen for potential errors
      socket.once("error", (error) => {
        setError(error.message);
        socket.disconnect();
      });

    } catch (err) {
      setError("Failed to connect to chat server");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Chat</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Join Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}
