import { AttachmentButton, MessageInput, SendButton } from '@chatscope/chat-ui-kit-react';
import { useMessageStore } from '@shared/store/messageStore';
import { useTypingStore } from '@shared/store/typingStore';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type CustomMessageInputProps = {
    currentChatId: string;
    currentUserId: string;
}

export const CustomMessageInput: React.FC<CustomMessageInputProps> = ({currentChatId, currentUserId}) => {
    const setTyping = useTypingStore((state) => state.setTyping);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const sendMessage = useMessageStore((state) => state.sendMessage);
    const [message, setMessage] = useState("");
    const [mediaMessage, setMediaMessage] = useState("");

    useEffect(() => {
        if (mediaMessage) {
            handleMessageSend();
        }
    }, [mediaMessage]);

    const handleMessageSend = useCallback(() => {
        if ((message.trim() || mediaMessage.trim()) && currentChatId && currentUserId) {
            sendMessage(currentChatId, currentUserId, message, mediaMessage);
            setTyping(currentChatId, currentUserId, false);
            setMediaMessage("");
            setMessage("");
        }
    }, [message, mediaMessage, currentChatId, currentUserId, sendMessage, setTyping]);


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
        setTyping(currentChatId, currentUserId, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setTyping(currentChatId, currentUserId, false);
        }, 3000);
    }, [currentChatId, currentUserId, setTyping]);

    return (
        <>                
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            <AttachmentButton onClick={handleAttachClick} />
            <MessageInput
                className="flex-1"
                value={message}
                onChange={handleTyping}
                onSend={handleMessageSend}
                autoFocus={true}
                placeholder="Type message here..."
                onAttachClick={handleAttachClick}
                attachButton={false}
                sendButton={false}
                style={{ borderTop: '0px solid black'}}
            />

            <SendButton onClick={handleMessageSend} />
        </>
    );
};
