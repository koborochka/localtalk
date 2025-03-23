import { useUserStore } from "@shared/store/userStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChatStore } from "@shared/store/chatStore";
import { useMessageStore } from "@shared/store/messageStore";
import { Chat } from "@app/types/Chat";
import { User } from "@app/types/User";
import { ChatContainer, ConversationHeader, InfoButton, MainContainer, Message, MessageGroup, MessageInput, MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { formatTime } from "@utils/formatTime";
import { groupMessages } from "@utils/groupMessages";
import { useTypingStore } from "@shared/store/typingStore";


export const ChatRoom = React.memo(() => {
    const currentUserId = useUserStore((state) => state.currentUserId);
    const currentChatId = useChatStore((state) => state.currentChatId);
    const chats = useChatStore((state) => state.chats);
    const users = useUserStore((state) => state.users);

    const currentChat = chats.find((chat) => chat.id === currentChatId) || ({} as Chat);
    const currentUser = users.find((user) => user.id === currentUserId) || ({} as User);

    const sendMessage = useMessageStore((state) => state.sendMessage);
    const [message, setMessage] = useState("");
    const [mediaMessage, setMediaMessage] = useState("");

    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    const typingUsersId = useTypingStore((state) => state.typingUsers[currentChat.id]);
    const setTyping = useTypingStore((state) => state.setTyping);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const typingUsers = users
        .filter((user) => typingUsersId?.includes(user.id) && user.id !== currentUser.id)
        .map((user) => user.name);

    useEffect(() => {
        if (mediaMessage) {
            handleMessageSend();
        }
    }, [mediaMessage]);

    const handleMessageSend = useCallback(() => {
        if ((message.trim() || mediaMessage.trim()) && currentChat.id && currentUser.id) {
            sendMessage(currentChat.id, currentUser.id, message, mediaMessage);
            setTyping(currentChat.id, currentUser.id, false);
            setMediaMessage("");
            setMessage("");
        }
    }, [message, mediaMessage, currentChat.id, currentUser.id, sendMessage, setTyping]);


    const handleAttachClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setMediaMessage(base64String)
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        reader.readAsDataURL(file);
    };

    const handleTyping = useCallback((value: string) => {
        setMessage(value);
        setTyping(currentChat.id, currentUser.id, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setTyping(currentChat.id, currentUser.id, false);
        }, 3000);
    }, [currentChat.id, currentUser.id, setTyping]);

    const openFullScreenImage = (src: string | undefined) => {
        if (src) {
            setFullScreenImage(src);
        }
    };

    const closeFullScreenImage = () => {
        setFullScreenImage(null);
    };

    if (!chats.length || !users.length || !currentChatId || !currentUserId) {
        return (
            <div className="flex items-center justify-center h-[92vh]">
                <p className="text-center text-5xl text-[#636567]">Loading...</p>
            </div>
        );    }

    const groupedMessages = groupMessages(currentChat, currentUser, users)

    return (
        <>
            {fullScreenImage && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={closeFullScreenImage}
                >
                    <img
                        src={fullScreenImage}
                        alt="fullscreen-img"
                        className="max-w-full max-h-full"
                    />
                </div>
            )}

            <MainContainer style={{
                height: '92vh',
                maxWidth: '80vw',
                margin: '0 auto'
            }}>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
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

                    <MessageList typingIndicator={typingUsers.length > 0
                        ? <TypingIndicator content={`${typingUsers.join(", ")} печатает...`} />
                        : null} >

                        {groupedMessages.map((group, index) => (
                            <MessageGroup key={index} direction={group.direction} sender={group.senderName} sentTime={group.messages[0].date}>
                                {group.direction == 'incoming' ?
                                    <MessageGroup.Header>{group.senderName}</MessageGroup.Header>
                                    : ''
                                }
                                <MessageGroup.Messages >
                                    {group.messages.map((msg) => (
                                        <Message
                                            key={msg.id}
                                            model={{
                                                message: msg.text,
                                                direction: group.direction,
                                                position: 'normal'
                                            }}
                                            onDoubleClick={() => openFullScreenImage(msg.media)}
                                        >
                                            {msg.media ? (
                                                <Message.ImageContent
                                                    src={msg.media}
                                                    alt="sent-img"
                                                    className="cursor-pointer"
                                                    width={400}
                                                />
                                            ) : null}
                                        </Message>
                                    ))}
                                </MessageGroup.Messages>
                                <MessageGroup.Footer style={{ marginLeft: group.direction == 'outgoing' ? 'auto' : '' }}>{formatTime(group.messages[group.messages.length - 1].date)}</MessageGroup.Footer>
                            </MessageGroup>
                        ))}

                    </MessageList>

                    <MessageInput
                        value={message}
                        onChange={handleTyping}
                        onSend={handleMessageSend}
                        autoFocus={true}
                        placeholder="Type message here..."
                        onAttachClick={handleAttachClick}
                    />
                </ChatContainer>
            </MainContainer>
        </>
    );
});
