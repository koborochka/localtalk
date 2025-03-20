import { Chat } from "@app/types/Chat";
import { Message } from "@app/types/Message";
import { User } from "@app/types/User";

export const groupMessages = (
	currentChat: Chat,
	currentUser: User,
	users: User[]
) => {
    
	const groupedMessages: {
		senderId: string;
		senderName: string;
		direction: "incoming" | "outgoing";
		messages: Message[];
	}[] = [];

	currentChat.messages.forEach((message) => {
		const direction =
			message.userId === currentUser.id ? "outgoing" : "incoming";
		const sender = users.find((user) => user.id === message.userId);
		const senderName = sender?.name || "Unknown";

		if (
			groupedMessages.length > 0 &&
			groupedMessages[groupedMessages.length - 1].senderId ===
				message.userId
		) {
			groupedMessages[groupedMessages.length - 1].messages.push(message);
		} else {
			groupedMessages.push({
				senderId: message.userId,
				senderName,
				direction,
				messages: [message],
			});
		}
	});

    return groupedMessages;
};
