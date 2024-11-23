import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useChat } from "./ChatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = () => {
  const { messages, addMessage, isTyping, setIsTyping } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: "user", content: input.trim() };
    addMessage(userMessage);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5002/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      addMessage({ role: "assistant", content: data.response });
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 bg-blue-500 text-white rounded-t-lg">
        <h3 className="font-bold">Course Learning Assistant</h3>
        <p className="text-sm opacity-90">Ask me about your learning path!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isUser={message.role === "user"}
          />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
