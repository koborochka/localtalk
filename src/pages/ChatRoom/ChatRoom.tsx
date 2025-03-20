import { useUserStore } from "@shared/store/userStore";
import { useState } from "react";
import { useChatStore } from "@shared/store/chatStore";
import { useMessageStore } from "@shared/store/messageStore";
import { Chat } from "@app/types/Chat";
import { User } from "@app/types/User";
import { ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageInput, MessageList, MessageSeparator, TypingIndicator } from "@chatscope/chat-ui-kit-react";


export const ChatRoom = () => {
    const currentUserId = useUserStore((state) => state.currentUserId);
    const currentChatId = useChatStore((state) => state.currentChatId);
    const chats = useChatStore((state) => state.chats);
    const users = useUserStore((state) => state.users)

    const currentChat = chats.find((chat) => chat.id === currentChatId) || ({} as Chat);
    const currentUser = users.find((user) => user.id === currentUserId) || ({} as User);

    const sendMessage = useMessageStore((state) => state.sendMessage);
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() && currentChat.id && currentUser.id) {
            sendMessage(currentChat.id, currentUser.id, message);
            setMessage("");
        }
    };

    return (
        <MainContainer style={{
            height: '500px',
            margin: '0 auto'
        }}>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Content
                        info={`room: ${currentChat.name}`}
                        className="text-xl text-center"
                    />
                    <ConversationHeader.Actions>
                        <InfoButton title="Show info" />
                    </ConversationHeader.Actions>
                </ConversationHeader>

                <MessageList /*typingIndicator={<TypingIndicator content="Emily is typing" */ >
                    <MessageSeparator content="Saturday, 30 November 2019" />
                    {currentChat.messages.map((message) => {
                        const direction = message.userId == currentUserId ? 'outgoing' : 'incoming'
                        const date = message.date
                        const userName = users.find((user)=>user.id == message.userId)?.name

                        return (
                            <Message
                                model={{
                                    direction: direction,
                                    message: message.text,
                                    position: 'single',
                                    sender: userName,
                                    sentTime: date
                                }}
                            /> 
                        )
                    })}
                      
                </MessageList>

                <MessageInput value={message} onChange={setMessage} onSend={handleSend} autoFocus={true} placeholder="Type message here..." />

            </ChatContainer>
        </MainContainer>
    );
};
