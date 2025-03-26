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
        <div className="flex flex-wrap justify-center justify-items-center items-center max-w-screen mt-40">
            <form className="flex flex-col items-center gap-2 justify-center bg-gray-50 p-4 pt-8 rounded-lg shadow-md w-[40%] min-w-[250px]" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Member Login</h2>         
                <input
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    type="text"
                    placeholder="User name"
                    value={userName}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    type="text"
                    placeholder="Room name"
                    value={chatName}
                    onChange={(e) => setchatName(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-700 cursor-pointer" onClick={handleLogin}>
                    Log in
                </button>
            </form>
        </div>

    );
};
