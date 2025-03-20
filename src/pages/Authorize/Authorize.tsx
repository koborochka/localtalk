import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@shared/store/userStore";
import { useChatStore } from "@shared/store/chatStore";


export const Authorize = () => {
  const [userName, setName] = useState<string>("");
  const [chatName, setchatName] = useState<string>("");
  const setUser = useUserStore((state) => state.setUser);
  const setChat = useChatStore((state) => state.setChat);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (userName.trim() && chatName.trim()) {
      setUser(userName);
      setChat(chatName);
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold">Вход в чат</h2>
      <input
        className="border p-2 m-2"
        type="text"
        placeholder="Введите имя"
        value={userName}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 m-2"
        type="text"
        placeholder="Введите комнату"
        value={chatName}
        onChange={(e) => setchatName(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
};
