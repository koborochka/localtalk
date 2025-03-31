import { Message } from "@app/types/Message";
import { useChatStore } from "@shared/store/chatStore";
import { create } from "zustand";

const channel = new BroadcastChannel("chat_channel");
type MessageStoreProps = {
	sendMessage: (
		chatId: string,
		userId: string,
		text: string,
		media?: string
	) => void;
	editMessage: (chatId: string, messageId: string, newText: string) => void;
	deleteMessage: (chatId: string, messageId: string) => void;
};

export const useMessageStore = create<MessageStoreProps>(() => {
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
            channel.postMessage({
                type: "DELETE_MESSAGE",
                chatId,
                messageId,
            });
		},

	};
});
