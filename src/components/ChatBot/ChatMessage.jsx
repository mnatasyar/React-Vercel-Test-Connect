/* eslint-disable react/prop-types */
import { User, Bot } from "lucide-react";

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-2`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
