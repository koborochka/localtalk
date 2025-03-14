import { create } from "zustand";
import { Chat } from "../../app/types/Chat";
import { Message } from "../../app/types/Message";




type ChatStore = {
    chats: Chat[];
    currentChat: Chat | null;
    setChat: (name: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    chats: JSON.parse(localStorage.getItem("chats") || "[]"),
    currentChat: null,

    setChat: (name) => {
        set((state) => {
            let chats = [...state.chats];
            let chat = chats.find((chat) => chat.name === name);

            if (!chat) {
                chat = {
                    id: crypto.randomUUID(),
                    name,
                    messages: [] as Message[],
                    pinnedMessagesID: [],
                };
                chats.push(chat);
            }
            
            localStorage.setItem("chats", JSON.stringify(chats));
            return { chats, currentChat: chat };
        });
    },
}));

