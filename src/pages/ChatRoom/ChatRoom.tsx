import { useUserStore } from "@shared/store/userStore";
import React, { useEffect, useState } from "react";
import { useChatStore } from "@shared/store/chatStore";
import { Chat } from "@app/types/Chat";
import { User } from "@app/types/User";
import {  ChatContainer, ConversationHeader, InfoButton, InputToolbox, MainContainer,  MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";

import { useTypingStore } from "@shared/store/typingStore";
import { CustomMessageList } from "@widgets/MessageList/CustomMessageList";
import { CustomMessageInput } from "@widgets/MessageInput/CustomMessageInput";
import { ChatInfoModal } from "@shared/components/ChatInfoModal";

export const ChatRoom = React.memo(() => {
    const { currentUserId, users, getUsers, isGettingUsers, isLoggingIn} = useUserStore();
    const { currentChatId, chats, getChats, isGettingChats, isEnteringInChat} = useChatStore();

    const [isModalOpen, setIsModalOpen] = useState(false); 

    const currentChat = chats.find((chat) => chat.id === currentChatId) || ({} as Chat);
    const currentUser = users.find((user) => user.id === currentUserId) || ({} as User);

    const typingUsersId = useTypingStore((state) => state.typingUsers[currentChat.id]);

    const typingUsers = users
        .filter((user) => typingUsersId?.includes(user.id) && user.id !== currentUser.id)
        .map((user) => user.name);

    useEffect(() => {
        getChats()
        getUsers()
    }, [getChats, getUsers]);


    if (isGettingChats || isGettingUsers || isLoggingIn || isEnteringInChat || chats.length === 0 || users.length === 0) {
        
        return (
            <div className="flex items-center justify-center h-[92vh]">
                <p className="text-center text-5xl text-[#636567]">Загрузка...</p>
            </div>
        );
    }

    return (
        <>
        <MainContainer className="w-full md:max-w-[80vw] mx-auto"
            style={{height: '92vh'}}>
                <ChatInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content
                            info={`Комната: ${currentChat.name}`}
                            className="text-3xl text-center"
                        />
                        <ConversationHeader.Actions>
                            <InfoButton title="Show info" onClick={() => setIsModalOpen((prev)=> !prev)} />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    <MessageList typingIndicator={typingUsers.length > 0
                        ? <TypingIndicator className="pl-1 ml-15" content={`${typingUsers.join(", ")} печатает...`} />
                        : null} >

                        <MessageList.Content className="pb-10">
                            <CustomMessageList {...{currentChatId, currentUserId, chats, users}} />
                        </MessageList.Content>

                    </MessageList>

                    <InputToolbox className="flex items-center" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                        <CustomMessageInput currentChatId={currentChat.id} currentUserId={currentUser.id} />
                    </InputToolbox>

                </ChatContainer>
            </MainContainer>
        </>
    );
});
