import { Avatar, Message, MessageGroup, MessageList } from '@chatscope/chat-ui-kit-react';
import { formatTime } from "@utils/formatTime";
import { groupMessages } from "@utils/groupMessages";
import React, { useRef, useState } from 'react';
import userAvatarPlaceholder from '@shared/assets/user_placeholder.png';
import { Message as MessageType } from "@app/types/Message";
import { useMessageStore } from '@features/messages/messageStore';
import { Chat } from '@app/types/Chat';
import { User } from '@app/types/User';
import ContextMenu from '@shared/components/ContextMenu';
import '@shared/ui/styles/message-list.css'

type ContextMenuState = {
    x: number;
    y: number;
    items: ContextMenuItem[];
} | null;

type ContextMenuItem = {
    label: string;
    onClick: () => void;
};

type CustomMessageListProps = {
    currentUserId: string | null,
    currentChatId: string | null,
    chats: Chat[],
    users: User[],
}

export const CustomMessageList: React.FC<CustomMessageListProps> = ({ currentChatId, currentUserId, chats, users }) => {
    const currentChat = chats.find((chat) => chat.id === currentChatId) || ({} as Chat);
    const currentUser = users.find((user) => user.id === currentUserId) || ({} as User);

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editedMessageText, setEditedMessageText] = useState<string>("");
    const originalMessageText = useRef<string>("");

    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

    const { editMessage, deleteMessage } = useMessageStore();

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedMessageText(e.target.value);
    };

    const handleEditSubmit = (msgId: string) => {
        if (editedMessageText.trim() && editedMessageText.trim() !== originalMessageText.current.trim()) {
            editMessage(currentChat.id, msgId, editedMessageText);
        }
        setEditingMessageId(null);
        setEditedMessageText("");
        originalMessageText.current = "";
    };

    const handleEditClick = (msg: MessageType) => {
        setEditingMessageId(msg.id);
        setEditedMessageText(msg.text ? msg.text : "");
        originalMessageText.current = msg.text || "";
    };

    const handleDeleteClick = (msgId: string) => {
        deleteMessage(currentChat.id, msgId);
    };

    const handleContextMenu = (event: React.MouseEvent, msg: MessageType) => {
        event.preventDefault();
        const isOwnMessage = msg.userId === currentUser.id;
        const canEdit = !msg.media;

        if (isOwnMessage) {
            setContextMenu({
                x: event.pageX,
                y: event.pageY,
                items: [
                ...(canEdit ? [{ label: "✏️ Изменить", onClick: () => handleEditClick(msg) }] : []),
                    { label: "🗑️ Удалить", onClick: () => handleDeleteClick(msg.id) }
                ]
            });
        }
    };

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
                <p className="text-center text-5xl text-[#636567]">Загрузка...</p>
            </div>
        );
    }

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

            {groupedMessages.length ? groupedMessages.map((group, index) => (
                <MessageGroup
                    key={index}
                    direction={group.direction}
                    sender={group.senderName}
                    sentTime={group.messages[0].date}
                >
                    {group.direction == 'incoming' ?
                        <MessageGroup.Header className="font-semibold">{group.senderName}</MessageGroup.Header>
                        : ''
                    }
                    {group.direction == 'incoming' ?
                        <Avatar src={users.find((user) => user.id === group.senderId)?.avatar || userAvatarPlaceholder} name={group.senderName} />
                        : ''
                    }
                    <MessageGroup.Messages>
                        {group.messages.map((msg) => (
                            <Message
                                key={msg.id}
                                className="relative w-fit overflow-visible font-jost"
                                model={{
                                    direction: group.direction,
                                    position: 'normal',
                                    message: msg.text,
                                    type: 'text'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, msg)}
                                onClick={() => openFullScreenImage(msg.media)}
                            >

                                {msg.id === editingMessageId ? (
                                    <Message.CustomContent>
                                        <input
                                            type="text"
                                            value={editedMessageText}
                                            onChange={handleEditChange}
                                            onBlur={() => handleEditSubmit(msg.id)}
                                            onKeyDown={(e) => e.key === "Enter" && handleEditSubmit(msg.id)}
                                            className="border p-1 w-full"
                                            autoFocus
                                        />
                                    </Message.CustomContent>
                                ) : (
                                    msg.media ? (
                                        <Message.ImageContent
                                            src={msg.media}
                                            alt="sent-img"
                                            className="cursor-pointer"
                                            width={400}
                                        />
                                    ) : (
                                        <Message.TextContent>{msg.text}</Message.TextContent>
                                    )
                                )}

                                {msg.edited ? (
                                    <Message.Footer style={{ marginLeft: group.direction == 'outgoing' ? 'auto' : '' }}
                                    >Изменено</Message.Footer>
                                ) : null}
                            </Message>
                        ))}
                    </MessageGroup.Messages>
                    <MessageGroup.Footer style={{ marginLeft: group.direction == 'outgoing' ? 'auto' : '' }}>{formatTime(group.messages[group.messages.length - 1].date)}</MessageGroup.Footer>
                </MessageGroup>
            )) : <MessageList.Content>
                <div className="flex items-center justify-center h-[92vh]">
                    <p className="text-center text-4xl text-[#636567]">Напишите свое первое сообщение в этом чате!</p>
                </div>
            </MessageList.Content>}
            <ContextMenu
                isOpen={!!contextMenu}
                position={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : { x: 0, y: 0 }}
                items={contextMenu?.items || []}
                onClose={() => setContextMenu(null)}
            />
        </>
    );
};
