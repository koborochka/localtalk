import { Navigate, Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Header } from "@widgets/Header/Header"
import { Authorize } from "@pages/Authorize/Authorize"
import { ChatRoom } from "@pages/ChatRoom/ChatRoom"
import { Profile } from "@pages/Profile/Profile"

function App() {
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#FFD3FD] to-[#8EB2FB]">
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<Authorize />} />
                <Route path="/chat" element={<ChatRoom />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    )
}

export default App

