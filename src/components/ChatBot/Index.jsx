import { ChatProvider } from "./ChatContext";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import { useChat } from "./ChatContext";

const ChatBotContent = () => {
  const { isOpen } = useChat();

  return (
    <>
      <ChatButton />
      {isOpen && <ChatWindow />}
    </>
  );
};

const ChatBot = () => {
  return (
    <ChatProvider>
      <ChatBotContent />
    </ChatProvider>
  );
};

export default ChatBot;
