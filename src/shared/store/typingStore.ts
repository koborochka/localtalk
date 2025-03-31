import { create } from "zustand";

type TypingStoreProps = {
	typingUsers: Record<string, string[]>; // { chatId: ["User1", "User2"] }
	setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
};

const channel = new BroadcastChannel("typing_channel");

const updateTypingUsers = (
	typingUsers: Record<string, string[]>,
	chatId: string,
	userId: string,
	isTyping: boolean
) => {
	const updatedTypingUsers = { ...typingUsers };

	if (isTyping) {
		if (!updatedTypingUsers[chatId]?.includes(userId)) {
			updatedTypingUsers[chatId] = [
				...(updatedTypingUsers[chatId] || []),
				userId,
			];
		}
	} else {
		updatedTypingUsers[chatId] =
			updatedTypingUsers[chatId]?.filter((id) => id !== userId) || [];
	}

	return updatedTypingUsers;
};

export const useTypingStore = create<TypingStoreProps>((set) => {
	channel.onmessage = (event) => {
		if (event.data.type === "TYPING_STATUS") {
			const { chatId, userId, isTyping } = event.data;
			set((state) => {
				const updatedTypingUsers = updateTypingUsers(
					state.typingUsers,
					chatId,
					userId,
					isTyping
				);
		
                return { typingUsers: updatedTypingUsers };
			});
		}
	};

	return {
		typingUsers: {},
		setTyping: (chatId, userId, isTyping) => {
			channel.postMessage({
				type: "TYPING_STATUS",
				chatId,
				userId,
				isTyping,
			});

			set((state) => {
				const updatedTypingUsers = updateTypingUsers(
					state.typingUsers,
					chatId,
					userId,
					isTyping
				);

                return { typingUsers: updatedTypingUsers };
			});
		},
	};
});
