import { Message } from '../../app/types/Message';
import { useChatStore } from './chatStore';
import { create } from "zustand";

type MessageStore = {
  sendMessage: (chatId: string, userId: string, text: string) => void;
  editMessage: (chatId: string, messageId: string, newText: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
      sendMessage: (chatId, userId, text) => {
        set((state) => {
          const chatStore = useChatStore.getState();
          const chats = chatStore.chats.map((chat) => {
            if (chat.id === chatId) {
              const newMessage: Message = {
                id: crypto.randomUUID(),
                chatId,
                userId,
                text,
                date: new Date().toISOString(),
                edited: false,
                reactions: {},
              };
              return { ...chat, messages: [...chat.messages, newMessage] }; 
            }
            return chat;
          });
      
          localStorage.setItem("chats", JSON.stringify(chats));
      
          // Обновляем `chats` и `currentChat` в useChatStore
          useChatStore.setState({
            chats,
            currentChat: chats.find((chat) => chat.id === chatId) || null,
          });
      
          return { ...state }; 
        });
      },
      
      

  editMessage: (chatId, messageId, newText) => {
    set((state) => {
      const chatStore = useChatStore.getState();
      const chats = chatStore.chats.map((chat) => {
        if (chat.id === chatId) {
          const messages = chat.messages.map((msg) =>
            msg.id === messageId ? { ...msg, text: newText, edited: true } : msg
          );
          return { ...chat, messages };
        }
        return chat;
      });

      localStorage.setItem("chats", JSON.stringify(chats));
      chatStore.chats = chats;

      return { ...state }; 
    });
  },

  deleteMessage: (chatId, messageId) => {
    set((state) => {
      const chatStore = useChatStore.getState();
      const chats = chatStore.chats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, messages: chat.messages.filter((msg) => msg.id !== messageId) };
        }
        return chat;
      });

      localStorage.setItem("chats", JSON.stringify(chats));
      chatStore.chats = chats;

      return { ...state }; 
    });
  },

  addReaction: (chatId, messageId, emoji, userId) => {
    set((state) => {
      const chatStore = useChatStore.getState();
      const chats = chatStore.chats.map((chat) => {
        if (chat.id === chatId) {
          const messages = chat.messages.map((msg) => {
            if (msg.id === messageId) {
              const reactions = { ...msg.reactions };
              if (!reactions[emoji]) {
                reactions[emoji] = [];
              }
              if (!reactions[emoji].includes(userId)) {
                reactions[emoji].push(userId);
              }
              return { ...msg, reactions };
            }
            return msg;
          });
          return { ...chat, messages };
        }
        return chat;
      });

      localStorage.setItem("chats", JSON.stringify(chats));
      chatStore.chats = chats;

      return { ...state }; 
    });
  },
}));