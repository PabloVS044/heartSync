import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chats/user/${userId}`);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();

    return () => newSocket.disconnect();
  }, [userId]);

  useEffect(() => {
    if (socket && currentChatId) {
      socket.emit('joinChat', currentChatId);

      socket.on('message', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error.message);
      });

      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/chats/${currentChatId}`);
          setMessages(response.data.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();

      return () => {
        socket.off('message');
        socket.off('error');
      };
    }
  }, [socket, currentChatId]);

  const sendMessage = () => {
    if (message.trim() && currentChatId) {
      socket.emit('sendMessage', {
        chatId: currentChatId,
        senderId: userId,
        content: message
      });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Your Matches and Chats</h2>
      <ul>
        {chats.map(({ chat, otherUser }) => (
          <li key={chat.id} onClick={() => setCurrentChatId(chat.id)}>
            Chat with {otherUser.name} (Match created: {new Date(chat.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
      {currentChatId && (
        <div>
          <h3>Messages</h3>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong> {msg.content} <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            style={{ width: '80%', margin: '10px 0' }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;