import { create } from "zustand";
import { Chat } from "@app/types/Chat"; 
import { Message } from "@app/types/Message";

const channel = new BroadcastChannel("chat_channel"); 

type ChatStore = {
	chats: Chat[];
    currentChatId: string | null;

	setChat: (name: string) => void;
};

export const useChatStore = create<ChatStore>((set) => {	
	const storedChats = JSON.parse(localStorage.getItem("chats") || "[]");
    const storedChatId = sessionStorage.getItem("currentChatId") || ""; 

	channel.onmessage = (event) => {
		if (event.data.type === "UPDATE_CHATS") {
			set({ chats: event.data.chats });
		}
        if (event.data.type === "UPDATE_CHAT" && event.data.chatId) {
            const chatStore = useChatStore.getState();
            const chats = chatStore.chats.map((chat) => {
              if (chat.id === event.data.chatId) {
                return { ...chat, messages: event.data.messages }; 
              }
              return chat;
            });

            localStorage.setItem("chats", JSON.stringify(chats));
            set({ chats });
        }
	};

	return {
		chats: storedChats,
        currentChatId: storedChatId,

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

                    localStorage.setItem("chats", JSON.stringify(chats));   
                    channel.postMessage({
                        type: "UPDATE_CHATS",
                        chats
                    });
				}

                sessionStorage.setItem("currentChatId", chat.id); 

				return { chats, currentChatId: chat.id };
			});
		},
	};
});
