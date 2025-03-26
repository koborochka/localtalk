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

			channel.postMessage({
				type: "ADD_MESSAGE",
				chatId,
				message: newMessage,
			});
		},

		editMessage: async (chatId, messageId, newText) => {
            const chatStore = useChatStore.getState();
            const chat = chatStore.chats.find((chat) => chat.id === chatId);
            const message =  chat?.messages.find((message) => message.id === messageId);
            const updatedMessage =  {...message, text: newText, edited: true };
                  
            channel.postMessage({
                type: "UPDATE_MESSAGE",
                chatId,
                messageId,
                message: updatedMessage,
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
