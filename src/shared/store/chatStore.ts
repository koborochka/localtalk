import { create } from "zustand";
import { Chat } from "../../app/types/Chat";
import { Message } from "../../app/types/Message";
import { db } from "@shared/lib/db/indexedDB";

const channel = new BroadcastChannel("chat_channel");

type ChatStore = {
	chats: Chat[];
	currentChatId: string | null;
        
	setChat: (name: string) => void;
};

export const useChatStore = create<ChatStore>((set) => {
	db.getAllChats().then((chats) => set({ chats }));

	const storedChatId = sessionStorage.getItem("currentChatId") || "";

	channel.onmessage = async (event) => {
		if (event.data.type === "UPDATE_CHATS") {
			set({ chats: event.data.chats });
		}
		if (event.data.type === "UPDATE_CHAT" && event.data.chatId) {
			db.updateChatMessages(event.data.chatId, event.data.messages);
			set((state) => {
				const updatedChats = state.chats.map((chat) =>
					chat.id === event.data.chatId
						? { ...chat, messages: event.data.messages }
						: chat
				);
				return { chats: updatedChats };
			});
		}
	};

	return {
		chats: [],
		currentChatId: storedChatId,

		setChat: async (name) => {
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

					db.addChat(chat);
					channel.postMessage({ type: "UPDATE_CHATS", chats });
				}

				sessionStorage.setItem("currentChatId", chat.id);

				return { chats, currentChatId: chat.id };
			});
		},
	};
});
