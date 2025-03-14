import { useUserStore } from "../../shared/store/userStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../shared/store/chatStore";
import { useMessageStore } from "../../shared/store/messageStore";

export const ChatRoom = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.currentUser);
    const chat = useChatStore((state) => state.currentChat);

    const sendMessage = useMessageStore((state) => state.sendMessage);
    const [message, setMessage] = useState("");

    if (!user || !chat) {
        navigate("/auth");
        return null;
    }

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(chat.id, user.id, message);
            setMessage("");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Комната: {chat.name}</h2>
            <h3 className="text-lg font-bold">Пользователь: {user.name}</h3>

            <div className="border p-2 my-2">
                {chat.messages.map((msg) => {
                    const currentUser = useUserStore.getState().users.find((u) => u.id === msg.userId);
                    return (
                        <p key={msg.id}>
                            <strong>{currentUser?.name}:</strong> {msg.text}
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
