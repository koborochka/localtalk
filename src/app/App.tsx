import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Header } from "@widgets/header/Header"
import { Authorize } from "@pages/Authorize/Authorize"
import { ChatRoom } from "@pages/ChatRoom/ChatRoom"

function App() {

    return (
        <>
            <Header />
            <Routes>
                <Route path="/auth" element={<Authorize />} />
                <Route path="/chat" element={<ChatRoom />} />
            </Routes>
        </>
    )
}

export default App

