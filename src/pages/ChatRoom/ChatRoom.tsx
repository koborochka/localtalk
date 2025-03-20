import { useUserStore } from "@shared/store/userStore";
import { useState } from "react";
import { useChatStore } from "@shared/store/chatStore";
import { useMessageStore } from "@shared/store/messageStore";
import { Chat } from "@app/types/Chat";
import { User } from "@app/types/User";
import { ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageGroup, MessageInput, MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { formatTime } from "@utils/formatTime";
import { groupMessages } from "@utils/groupMessages";


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

    const groupedMessages = groupMessages(currentChat, currentUser, users)

    return (
        <MainContainer style={{
            height: '650px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Content
                        info={`room: ${currentChat.name}`}
                        className="text-3xl text-center"
                    />
                    <ConversationHeader.Actions>
                        <InfoButton title="Show info" />
                    </ConversationHeader.Actions>
                </ConversationHeader>

                <MessageList >

                    {groupedMessages.map((group, index) => (
                        <MessageGroup key={index} direction={group.direction} sender={group.senderName} sentTime={group.messages[0].date}>
                            <MessageGroup.Header style={{marginLeft: group.direction == 'outgoing' ? 'auto' : ''}} >{group.senderName}</MessageGroup.Header>
                            <MessageGroup.Messages >
                                {group.messages.map((msg) => (
                                    <Message
                                        key={msg.id}
                                        model={{
                                            message: msg.text,
                                            direction: group.direction,
                                            position: 'normal'
                                        }}
                           
                                    />
                                ))}
                            </MessageGroup.Messages>
                            <MessageGroup.Footer style={{marginLeft: group.direction == 'outgoing' ? 'auto' : ''}}>{formatTime(group.messages[group.messages.length - 1].date)}</MessageGroup.Footer>
                        </MessageGroup>
                    ))}

                </MessageList>

                <MessageInput value={message} onChange={setMessage} onSend={handleSend} autoFocus={true} placeholder="Type message here..." />

            </ChatContainer>
        </MainContainer>
    );
};
