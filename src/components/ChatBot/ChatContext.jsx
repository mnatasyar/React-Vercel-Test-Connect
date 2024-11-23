/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Course Learning Assistant. I can help you create personalized learning paths, provide study tips, and answer questions about your courses!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        toggleChat,
        messages,
        addMessage,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
