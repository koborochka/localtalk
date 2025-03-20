import { useUserStore } from "../../shared/store/userStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../shared/store/chatStore";
import { useMessageStore } from "../../shared/store/messageStore";
import { Chat } from "../../app/types/Chat";
import { User } from "../../app/types/User";

export const ChatRoom = () => {
    const navigate = useNavigate();
    const currentUserId = useUserStore((state) => state.currentUserId);
    const currentChatId = useChatStore((state) => state.currentChatId);
    const chats = useChatStore((state) => state.chats);
    const users = useUserStore((state) => state.users)

    const sendMessage = useMessageStore((state) => state.sendMessage);
    const [message, setMessage] = useState("");

    if (!currentUserId || !currentChatId) {
        navigate("/auth");
        return null;
    }

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(currentChatId, currentUserId, message);
            setMessage("");
        }
    };

    let currentChat = chats.find((chat) => chat.id == currentChatId)
    if (!currentChat) {
        currentChat = {} as Chat
    }

    let currentUser = users.find((user) => user.id == currentUserId)
    if (!currentUser) {
        currentUser = {} as User
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Комната: {currentChat.name}</h2>
            <h3 className="text-lg font-bold">Пользователь: {currentUser.name}</h3>

            <div className="border p-2 my-2">
                {currentChat.messages.map((msg) => {
                    const user = users.find((u) => u.id === msg.userId);
                    return (
                        <p key={msg.id}>
                            <strong>{user?.name}:</strong> {msg.text}
                        </p>
                    )
                })}
            </div>
            <input
                className="border p-2 w-full"
                type="text"
                placeholder="Введите сообщение"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleSend}>
                Отправить
            </button>

        </div>
    );
};
