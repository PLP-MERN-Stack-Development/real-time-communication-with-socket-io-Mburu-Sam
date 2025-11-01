# Real-Time Chat Application

## 📝 Project Overview

A real-time chat application built using Socket.io, React, and Node.js. This application enables instant messaging between users, with features for both group and private communications. The project demonstrates bidirectional communication capabilities using Socket.io, modern React practices, and scalable server architecture.

## ✨ Features Implemented

### Core Chat Features

- Real-time messaging with instant delivery
- User authentication system (username-based)
- Global chat room functionality
- Message history with timestamps
- User online/offline status
- Typing indicators

### Advanced Features

- Private messaging between users
- Multiple chat rooms/channels support
- File and image sharing capabilities
- Message reactions (like, love, etc.)
- Read receipts
- "User is typing" indicators

### Notification System

- Real-time message notifications
- Join/leave chat notifications
- Unread message counter
- Sound alerts for new messages
- Browser notifications

### User Experience

- Responsive mobile-first design
- Message pagination
- Automatic reconnection handling
- Fast message delivery
- Intuitive user interface

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:

```bash
git clone [repository-url]
cd real-time-chat-application
```

2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

4. Start the application:

```bash
# Start the server (in server directory)
npm run dev

# Start the client (in client directory)
npm run dev
```

5. Access the application at http://localhost:5173

## 📸 Application Screenshots

### Login Screen

![Login Interface](screenshots/Screenshot 2025-11-01 at 11-42-44 socketio-chat.login.png)
_User authentication interface with username input_

### Main Chat Interface

![Main Chat Room](screenshots/Screenshot 2025-11-01 at 11-45-34 socketio-chat.png)
_Global chat room showing real-time messages and online users_
