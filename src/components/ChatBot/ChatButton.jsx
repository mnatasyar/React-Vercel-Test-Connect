import { MessageCircle, X } from "lucide-react";
import { useChat } from "./ChatContext";

const ChatButton = () => {
  const { isOpen, toggleChat } = useChat();

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 z-50"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </button>
  );
};

export default ChatButton;
