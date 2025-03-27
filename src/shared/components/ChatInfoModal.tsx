import React, { useEffect, useRef } from "react";

type ChatInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const ChatInfoModal: React.FC<ChatInfoModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Закрытие при клике вне окна
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-center text-2xl font-semibold mb-4">Как пользоваться чатом?</h2>
                <p className="mb-3">📩 Отправляйте сообщения с помощью кнопки "Отправить".</p>
                <p className="mb-3">📎 Прикрепляйте файлы через кнопку "Скрепка".</p>
                <p className="mb-3">😀 Используйте эмодзи для выражения эмоций.</p>
                <p className="mb-3">🖼️ Загрузите изображение для аватарки в профиле.</p>
                <p className="mb-3">✍️ Если собеседник набирает текст, вы увидите индикатор набора.</p>
                <p className="mb-3">✏️ Свои сообщения можно изменять и удалять нажав на них ПКМ.</p>
                <p className="mb-3">🔍 Просматривайте изображения в полноэкранном режиме нажав на них ЛКМ.</p>

                <button
                    className="mt-10 px-4 py-2 bg-blue-500 flex ml-auto mr-auto text-white rounded-md cursor-pointer hover:bg-blue-700"
                    onClick={onClose}
                >
                    Понятно
                </button>
            </div>
        </div>
    );
};
