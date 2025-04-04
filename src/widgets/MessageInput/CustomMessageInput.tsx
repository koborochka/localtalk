import { AttachmentButton, MessageInput, SendButton } from "@chatscope/chat-ui-kit-react";
import { useMessageStore } from "@features/messages/messageStore";
import { useTypingStore } from "@shared/store/typingStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

type CustomMessageInputProps = {
    currentChatId: string;
    currentUserId: string;
};

export const CustomMessageInput: React.FC<CustomMessageInputProps> = ({ currentChatId, currentUserId }) => {
    const setTyping = useTypingStore((state) => state.setTyping);
    const sendMessage = useMessageStore((state) => state.sendMessage);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [message, setMessage] = useState<string>("");
    const [mediaMessage, setMediaMessage] = useState<string>("");
    const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mediaMessage) {
            handleMessageSend();
        }
    }, [mediaMessage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsEmojiOpen(false);
            }
        };

        if (isEmojiOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isEmojiOpen]);

    const handleMessageSend = () => {
        const sanitizedMessage = message.replace(/&nbsp;/g, " ");

        if (mediaMessage.trim() && currentChatId && currentUserId) {
            sendMessage(currentChatId, currentUserId, "", mediaMessage);
            setMediaMessage("");
        } else if (sanitizedMessage.trim() && currentChatId && currentUserId) {
            sendMessage(currentChatId, currentUserId, sanitizedMessage, mediaMessage);
            setTyping(currentChatId, currentUserId, false);
            setMessage("");
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setMediaMessage(base64String);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        reader.readAsDataURL(file);
    };

    const handleTyping = useCallback(
        (value: string) => {
            setMessage(value);
            setTyping(currentChatId, currentUserId, true);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTyping(currentChatId, currentUserId, false);
            }, 3000);
        },
        [currentChatId, currentUserId, setTyping]
    );

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="relative flex items-center w-full">
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <AttachmentButton onClick={handleAttachClick} />

            <button
                type="button"
                className="p-2"
                onClick={() => setIsEmojiOpen((prev) => !prev)}
            >
                <FaSmile size={24} fill="#303754" className="cursor-pointer hover:opacity-60" />
            </button>

            {isEmojiOpen && (
                <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-10 w-9">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}

            <MessageInput
                className="flex-1"
                value={message}
                onChange={handleTyping}
                onSend={handleMessageSend}
                autoFocus={true}
                placeholder="Введите сообщение..."
                onAttachClick={handleAttachClick}
                attachButton={false}
                sendButton={false}
                style={{ borderTop: "0px solid black" }}
            />

            <SendButton onClick={handleMessageSend} />
        </div>
    );
};
