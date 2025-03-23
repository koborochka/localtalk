import { Chat } from "@app/types/Chat";
import { Message } from "@app/types/Message";
import { User } from "@app/types/User";
import { openDB } from "idb";

const dbPromise = openDB("localchatDB", 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains("chats")) {
			db.createObjectStore("chats", { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains("users")) {
			db.createObjectStore("users", { keyPath: "id" });
		}
	},
});

export const db = {
	async getAllChats() {
		return (await dbPromise).getAll("chats");
	},
	async addChat(chat: Chat) {
		return (await dbPromise).put("chats", chat);
	},
	async updateChats(chats: Chat[]) {
		const dbInstance = await dbPromise;
		const tx = dbInstance.transaction("chats", "readwrite");
		const store = tx.objectStore("chats");
		await Promise.all(chats.map((chat) => store.put(chat)));
		return tx.done;
	},
	async updateChatMessages(chatId: string, messages: Message[]) {
		const dbInstance = await dbPromise;
		const tx = dbInstance.transaction("chats", "readwrite");
		const store = tx.objectStore("chats");

		const chat = await store.get(chatId);
		if (!chat) return;

		chat.messages = messages;
		await store.put(chat);

		return tx.done;
	},
	async getAllUsers() {
		return (await dbPromise).getAll("users");
	},
	async addUser(user: User) {
		return (await dbPromise).put("users", user);
	},
};
