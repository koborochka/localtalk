import { Message } from "../../app/types/Message";
import { useChatStore } from "./chatStore";
import { create } from "zustand";

const channel = new BroadcastChannel("chat_channel");
type MessageStore = {
	sendMessage: (
		chatId: string,
		userId: string,
		text: string,
		media?: string
	) => void;
	editMessage: (chatId: string, messageId: string, newText: string) => void;
	deleteMessage: (chatId: string, messageId: string) => void;
	addReaction: (
		chatId: string,
		messageId: string,
		emoji: string,
		userId: string
	) => void;
};

export const useMessageStore = create<MessageStore>((set) => {
	return {
		sendMessage: async (chatId, userId, text, media?) => {
			const chatStore = useChatStore.getState();
			const chat = chatStore.chats.find((chat) => chat.id === chatId);

			if (!chat) return;

			const newMessage: Message = {
				id: crypto.randomUUID(),
				chatId,
				userId,
				text,
				media: media,
				date: new Date().toISOString(),
				edited: false,
				reactions: {},
			};

			const updatedMessages = [...chat.messages, newMessage];

			channel.postMessage({
				type: "UPDATE_CHAT",
				chatId,
				messages: updatedMessages,
			});
		},

		editMessage: (chatId, messageId, newText) => {
			set(() => {
				const chatStore = useChatStore.getState();
				const chats = chatStore.chats.map((chat) => {
					if (chat.id === chatId) {
						return {
							...chat,
							messages: chat.messages.map((msg) =>
								msg.id === messageId
									? { ...msg, text: newText, edited: true }
									: msg
							),
						};
					}
					return chat;
				});

				localStorage.setItem("chats", JSON.stringify(chats));
				useChatStore.setState({ chats });

				const updatedChat = chats.find((chat) => chat.id === chatId);
				if (updatedChat) {
					channel.postMessage({
						type: "UPDATE_CHAT",
						chatId,
						messages: updatedChat.messages,
					});
				}

				return {};
			});
		},

		deleteMessage: (chatId, messageId) => {
			set(() => {
				const chatStore = useChatStore.getState();
				const chats = chatStore.chats.map((chat) => {
					if (chat.id === chatId) {
						return {
							...chat,
							messages: chat.messages.filter(
								(msg) => msg.id !== messageId
							),
						};
					}
					return chat;
				});

				localStorage.setItem("chats", JSON.stringify(chats));
				useChatStore.setState({ chats });

				const updatedChat = chats.find((chat) => chat.id === chatId);
				if (updatedChat) {
					channel.postMessage({
						type: "UPDATE_CHAT",
						chatId,
						messages: updatedChat.messages,
					});
				}

				return {};
			});
		},

		addReaction: (chatId, messageId, emoji, userId) => {
			set(() => {
				const chatStore = useChatStore.getState();
				const chats = chatStore.chats.map((chat) => {
					if (chat.id === chatId) {
						return {
							...chat,
							messages: chat.messages.map((msg) => {
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
							}),
						};
					}
					return chat;
				});

				localStorage.setItem("chats", JSON.stringify(chats));
				useChatStore.setState({ chats });

				const updatedChat = chats.find((chat) => chat.id === chatId);
				if (updatedChat) {
					channel.postMessage({
						type: "UPDATE_CHAT",
						chatId,
						messages: updatedChat.messages,
					});
				}

				return {};
			});
		},
	};
});
