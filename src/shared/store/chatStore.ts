import { create } from "zustand";
import { Chat } from "@app/types/Chat";
import { Message } from "@app/types/Message";
import { db } from "@shared/lib/db/indexedDB";

const channel = new BroadcastChannel("chat_channel");

type ChatStoreProps = {
	chats: Chat[];
	currentChatId: string | null;
    isEnteringInChat: boolean;
	setChat: (name: string) => void;
	isGettingChats: boolean;
	getChats: () => void;
};

export const useChatStore = create<ChatStoreProps>((set, get) => {
	const storedChatId = sessionStorage.getItem("currentChatId") || "";

	channel.onmessage = async (event) => {
        if (event.data.type === "ADD_CHAT") {
            const state = get()
            const updatedChats = [...state.chats, event.data.chat];
			set({ chats: updatedChats });
		}
		if (event.data.type === "ADD_MESSAGE" && event.data.chatId) {
			await db.addMessageToChat(event.data.chatId, event.data.message);
			set((state) => {
				const updatedChats = state.chats.map((chat) =>
					chat.id === event.data.chatId
						? {
								...chat,
								messages: [
									...chat.messages,
									event.data.message,
								],
						  }
						: chat
				);
				return { chats: updatedChats };
			});
		}
		if (event.data.type === "UPDATE_MESSAGE" && event.data.chatId) {
			await db.updateMessageInChat(
				event.data.chatId,
				event.data.messageId,
				event.data.message
			);
			set((state) => {
				const updatedChats = state.chats.map((chat) =>
					chat.id === event.data.chatId
						? {
								...chat,
								messages: chat.messages.map((msg) =>
									msg.id === event.data.messageId
										? { ...msg, ...event.data.message }
										: msg
								),
						  }
						: chat
				);
				return { chats: updatedChats };
			});
		}
		if (event.data.type === "DELETE_MESSAGE" && event.data.chatId) {
			await db.deleteMessageFromChat(
				event.data.chatId,
				event.data.messageId
			);
			set((state) => {
				const updatedChats = state.chats.map((chat) =>
					chat.id === event.data.chatId
						? {
								...chat,
								messages: chat.messages.filter(
									(msg) => msg.id !== event.data.messageId
								),
						  }
						: chat
				);
				return { chats: updatedChats };
			});
		}
	};

	return {
		chats: [],
        isGettingChats: false,
		currentChatId: storedChatId,
        isEnteringInChat: false,

		setChat: async (name) => {
            set({isEnteringInChat: true});

            await get().getChats()

			const chats = get().chats;

			let chat = chats.find((chat) => chat.name === name);

			if (!chat) {
				chat = {
					id: crypto.randomUUID(),
					name,
					messages: [] as Message[],
				};
				chats.push(chat);

                
                channel.postMessage({ type: "ADD_CHAT", chat: chat });
                await db.addChat(chat);
			}

			sessionStorage.setItem("currentChatId", chat.id);
			set({ chats, currentChatId: chat.id, isEnteringInChat: false });
		},

        getChats: async () => {
            set({ isGettingChats: true });
            await db.getAllChats().then((chats) => set({ chats }));
            set({ isGettingChats: false });
        }
	};
});
